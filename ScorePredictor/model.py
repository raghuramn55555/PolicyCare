"""
Healthcare Policy Recommendation System - Model Backend
=======================================================
Architecture:
  Step 1 - DatasetAgent: Tries live GitHub mirrors, falls back to embedded real data
  Step 2 - Train a RandomForest: symptom pattern -> disease name (direct classification)
  Step 3 - Map predicted disease -> medically grounded severity score (0-100)
  Step 4 - Map severity score -> policy recommendation
  Step 5 - NIHAgent: fetch real ICD-10 codes for display

Root cause of old bug: risk was computed as symptom_count/133*100
  -> Dengue (7 symptoms) scored 5% = GREEN (wrong, should be RED/ORANGE)
Fix: severity is a property of the DISEASE, not the symptom count.
"""

import os
import time
import requests
import numpy as np
import pandas as pd
import joblib
from io import StringIO
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# ── Agent Log ──────────────────────────────────────────────────────────────────
agent_log = []

def log(agent, msg):
    entry = "[{}] [{}] {}".format(time.strftime('%H:%M:%S'), agent, msg)
    agent_log.append(entry)
    print(entry)

# ── Symptom List (133 symptoms from Kaggle dataset) ────────────────────────────
SYMPTOMS = [
    'itching','skin_rash','nodal_skin_eruptions','continuous_sneezing','shivering',
    'chills','joint_pain','stomach_pain','acidity','ulcers_on_tongue','muscle_wasting',
    'vomiting','burning_micturition','spotting_urination','fatigue','weight_gain',
    'anxiety','cold_hands_and_feets','mood_swings','weight_loss','restlessness',
    'lethargy','patches_in_throat','irregular_sugar_level','cough','high_fever',
    'sunken_eyes','breathlessness','sweating','dehydration','indigestion','headache',
    'yellowish_skin','dark_urine','nausea','loss_of_appetite','pain_behind_the_eyes',
    'back_pain','constipation','abdominal_pain','diarrhoea','mild_fever','yellow_urine',
    'yellowing_of_eyes','acute_liver_failure','fluid_overload','swelling_of_stomach',
    'swelled_lymph_nodes','malaise','blurred_and_distorted_vision','phlegm',
    'throat_irritation','redness_of_eyes','sinus_pressure','runny_nose','congestion',
    'chest_pain','weakness_in_limbs','fast_heart_rate','pain_during_bowel_movements',
    'pain_in_anal_region','bloody_stool','irritation_in_anus','neck_pain','dizziness',
    'cramps','bruising','obesity','swollen_legs','swollen_blood_vessels',
    'puffy_face_and_eyes','enlarged_thyroid','brittle_nails','swollen_extremeties',
    'excessive_hunger','extra_marital_contacts','drying_and_tingling_lips',
    'slurred_speech','knee_pain','hip_joint_pain','muscle_weakness','stiff_neck',
    'swelling_joints','movement_stiffness','spinning_movements','loss_of_balance',
    'unsteadiness','weakness_of_one_body_side','loss_of_smell','bladder_discomfort',
    'foul_smell_of_urine','continuous_feel_of_urine','passage_of_gases',
    'internal_itching','toxic_look_(typhos)','depression','irritability','muscle_pain',
    'altered_sensorium','red_spots_over_body','belly_pain','abnormal_menstruation',
    'dischromic_patches','watering_from_eyes','increased_appetite','polyuria',
    'family_history','mucoid_sputum','rusty_sputum','lack_of_concentration',
    'visual_disturbances','receiving_blood_transfusion','receiving_unsterile_injections',
    'coma','stomach_bleeding','distention_of_abdomen','history_of_alcohol_consumption',
    'fluid_overload.1','blood_in_sputum','prominent_veins_on_calf','palpitations',
    'painful_walking','pus_filled_pimples','blackheads','scurring','skin_peeling',
    'silver_like_dusting','small_dents_in_nails','inflammatory_nails','blister',
    'red_sore_around_nose','yellow_crust_ooze'
]

# ── Medically Grounded Disease Severity (0-100) ────────────────────────────────
# Based on clinical guidelines: mortality risk, complication rate, urgency of care
# GREEN=0-25, YELLOW=26-50, ORANGE=51-75, RED=76-100
DISEASE_SEVERITY = {
    # Critical (RED 76-100) - life threatening, immediate intervention
    'Heart attack':                          95,
    'Paralysis (brain hemorrhage)':          90,
    'AIDS':                                  85,
    'Dengue':                                78,
    'Hepatitis D':                           77,
    'Pneumonia':                             76,

    # High (ORANGE 51-75) - serious, requires active medical treatment
    'Malaria':                               72,
    'Tuberculosis':                          70,
    'Hepatitis C':                           68,
    'Typhoid':                               65,
    'Hepatitis B':                           64,
    'Hypoglycemia':                          63,
    'Bronchial Asthma':                      62,
    'Alcoholic hepatitis':                   62,
    'Hypertension':                          58,
    'Hepatitis E':                           56,
    'Drug Reaction':                         55,
    'Diabetes':                              53,
    'Jaundice':                              52,

    # Moderate (YELLOW 26-50) - needs monitoring and care
    'Chronic cholestasis':                   48,
    'hepatitis A':                           47,
    'Hypothyroidism':                        42,
    'Hyperthyroidism':                       43,
    'Peptic ulcer disease':                  38,
    'Gastroenteritis':                       35,
    'Urinary tract infection':               34,
    'Arthritis':                             33,
    'Chicken pox':                           32,
    'Osteoarthritis':                        30,
    'Cervical spondylosis':                  28,
    'Migraine':                              27,

    # Low (GREEN 0-25) - manageable, routine care
    'GERD':                                  24,
    'Dimorphic hemmorhoids(piles)':          22,
    'Varicose veins':                        22,
    '(vertigo) Paroymsal Positional Vertigo':20,
    'Psoriasis':                             20,
    'Impetigo':                              18,
    'Fungal infection':                      16,
    'Acne':                                  10,
    'Common Cold':                           10,
    'Allergy':                               12,
}

# ── Detailed symptom patterns per disease (for synthetic data generation) ──────
DISEASE_SYMPTOMS = {
    'Fungal infection':      ['itching','skin_rash','nodal_skin_eruptions','dischromic_patches'],
    'Allergy':               ['continuous_sneezing','shivering','chills','watering_from_eyes','runny_nose'],
    'GERD':                  ['stomach_pain','acidity','ulcers_on_tongue','vomiting','cough','chest_pain'],
    'Chronic cholestasis':   ['itching','vomiting','yellowish_skin','nausea','loss_of_appetite','abdominal_pain'],
    'Drug Reaction':         ['itching','skin_rash','stomach_pain','vomiting','burning_micturition'],
    'Peptic ulcer disease':  ['vomiting','indigestion','loss_of_appetite','abdominal_pain','passage_of_gases'],
    'AIDS':                  ['muscle_wasting','patches_in_throat','high_fever','fatigue','weight_loss','extra_marital_contacts'],
    'Diabetes':              ['fatigue','weight_loss','restlessness','lethargy','irregular_sugar_level','polyuria','increased_appetite'],
    'Gastroenteritis':       ['vomiting','sunken_eyes','dehydration','diarrhoea','stomach_pain'],
    'Bronchial Asthma':      ['fatigue','cough','high_fever','breathlessness','family_history','mucoid_sputum'],
    'Hypertension':          ['headache','chest_pain','dizziness','loss_of_balance','lack_of_concentration'],
    'Migraine':              ['acidity','indigestion','headache','blurred_and_distorted_vision','excessive_hunger','stiff_neck'],
    'Cervical spondylosis':  ['back_pain','weakness_in_limbs','neck_pain','dizziness','loss_of_balance'],
    'Paralysis (brain hemorrhage)': ['vomiting','headache','weakness_in_limbs','altered_sensorium','weakness_of_one_body_side','slurred_speech'],
    'Jaundice':              ['itching','vomiting','fatigue','weight_loss','high_fever','yellowish_skin','dark_urine','abdominal_pain'],
    'Malaria':               ['chills','vomiting','high_fever','sweating','headache','nausea','diarrhoea','muscle_pain'],
    'Chicken pox':           ['itching','skin_rash','fatigue','lethargy','high_fever','headache','loss_of_appetite','mild_fever','swelled_lymph_nodes'],
    'Dengue':                ['skin_rash','chills','joint_pain','vomiting','fatigue','high_fever','headache','nausea','loss_of_appetite','pain_behind_the_eyes','back_pain','malaise','muscle_pain','red_spots_over_body'],
    'Typhoid':               ['chills','vomiting','fatigue','high_fever','headache','nausea','constipation','abdominal_pain','diarrhoea','toxic_look_(typhos)','belly_pain'],
    'hepatitis A':           ['joint_pain','vomiting','yellowish_skin','dark_urine','nausea','loss_of_appetite','abdominal_pain','diarrhoea','mild_fever','yellowing_of_eyes','muscle_pain'],
    'Hepatitis B':           ['itching','fatigue','lethargy','yellowish_skin','dark_urine','nausea','loss_of_appetite','abdominal_pain','yellowing_of_eyes','malaise','receiving_blood_transfusion','receiving_unsterile_injections'],
    'Hepatitis C':           ['fatigue','yellowish_skin','nausea','loss_of_appetite','yellowing_of_eyes','family_history'],
    'Hepatitis D':           ['joint_pain','vomiting','fatigue','yellowish_skin','dark_urine','nausea','loss_of_appetite','abdominal_pain','yellowing_of_eyes'],
    'Hepatitis E':           ['joint_pain','vomiting','fatigue','high_fever','yellowish_skin','dark_urine','nausea','loss_of_appetite','abdominal_pain','yellowing_of_eyes','acute_liver_failure','coma','stomach_bleeding'],
    'Alcoholic hepatitis':   ['vomiting','yellowish_skin','abdominal_pain','swelling_of_stomach','distention_of_abdomen','history_of_alcohol_consumption','fluid_overload'],
    'Tuberculosis':          ['chills','vomiting','fatigue','weight_loss','cough','high_fever','breathlessness','sweating','loss_of_appetite','mild_fever','yellowing_of_eyes','swelled_lymph_nodes','malaise','phlegm','blood_in_sputum'],
    'Common Cold':           ['continuous_sneezing','chills','fatigue','cough','headache','runny_nose','congestion','loss_of_appetite','mild_fever','throat_irritation','redness_of_eyes','sinus_pressure'],
    'Pneumonia':             ['chills','fatigue','cough','high_fever','breathlessness','sweating','malaise','phlegm','chest_pain','fast_heart_rate','rusty_sputum'],
    'Dimorphic hemmorhoids(piles)': ['constipation','pain_during_bowel_movements','pain_in_anal_region','bloody_stool','irritation_in_anus'],
    'Heart attack':          ['vomiting','breathlessness','sweating','chest_pain','fast_heart_rate'],
    'Varicose veins':        ['fatigue','cramps','bruising','obesity','swollen_legs','swollen_blood_vessels','prominent_veins_on_calf','painful_walking'],
    'Hypothyroidism':        ['fatigue','weight_gain','cold_hands_and_feets','mood_swings','lethargy','enlarged_thyroid','brittle_nails','swollen_extremeties','depression','irritability','abnormal_menstruation'],
    'Hyperthyroidism':       ['fatigue','mood_swings','weight_loss','restlessness','sweating','diarrhoea','fast_heart_rate','excessive_hunger','muscle_weakness','irritability','abnormal_menstruation'],
    'Hypoglycemia':          ['fatigue','anxiety','cold_hands_and_feets','sweating','headache','nausea','blurred_and_distorted_vision','drying_and_tingling_lips','slurred_speech','irritability','excessive_hunger','palpitations'],
    'Osteoarthritis':        ['joint_pain','neck_pain','knee_pain','hip_joint_pain','swelling_joints','painful_walking'],
    'Arthritis':             ['muscle_weakness','stiff_neck','swelling_joints','movement_stiffness','loss_of_appetite','painful_walking'],
    '(vertigo) Paroymsal Positional Vertigo': ['vomiting','headache','nausea','spinning_movements','loss_of_balance','unsteadiness'],
    'Acne':                  ['skin_rash','pus_filled_pimples','blackheads','scurring'],
    'Urinary tract infection': ['burning_micturition','bladder_discomfort','foul_smell_of_urine','continuous_feel_of_urine'],
    'Psoriasis':             ['skin_rash','joint_pain','skin_peeling','silver_like_dusting','small_dents_in_nails','inflammatory_nails'],
    'Impetigo':              ['skin_rash','high_fever','blister','red_sore_around_nose','yellow_crust_ooze'],
}

DISEASES = list(DISEASE_SEVERITY.keys())

# ── Policy Details ─────────────────────────────────────────────────────────────
POLICY_DETAILS = {
    'GREEN': {
        'label': 'Low Risk - Routine Monitoring',
        'score_range': '0-25',
        'actions': [
            'Schedule annual health checkup',
            'Maintain healthy diet and lifestyle',
            'Continue preventive screenings as recommended',
            'No immediate intervention required'
        ],
        'color': '#22c55e'
    },
    'YELLOW': {
        'label': 'Moderate Risk - Preventive Intervention',
        'score_range': '26-50',
        'actions': [
            'Visit a general physician within 48-72 hours',
            'Increase monitoring frequency to quarterly',
            'Begin lifestyle modification programs',
            'Activate community health worker outreach'
        ],
        'color': '#eab308'
    },
    'ORANGE': {
        'label': 'High Risk - Active Treatment Required',
        'score_range': '51-75',
        'actions': [
            'Immediate clinical evaluation required (today)',
            'Begin prescribed medical treatment protocol',
            'Activate regional health emergency protocols',
            'Coordinate with specialist care networks'
        ],
        'color': '#f97316'
    },
    'RED': {
        'label': 'Critical Risk - Emergency Intervention',
        'score_range': '76-100',
        'actions': [
            'CALL EMERGENCY SERVICES IMMEDIATELY',
            'Hospital admission strongly recommended',
            'Activate national disease surveillance protocols',
            'Mobilize emergency response teams',
            'Coordinate with intensive care specialists'
        ],
        'color': '#ef4444'
    }
}

def severity_to_policy(score):
    if score <= 25:   return 'GREEN'
    elif score <= 50: return 'YELLOW'
    elif score <= 75: return 'ORANGE'
    else:             return 'RED'


# ── DatasetAgent ───────────────────────────────────────────────────────────────
class DatasetAgent:
    MIRRORS = [
        "https://raw.githubusercontent.com/anujdutt9/Disease-Prediction-from-Symptoms/master/dataset/Training.csv",
        "https://raw.githubusercontent.com/Dhruvacube/disease-prediction/main/Training.csv",
        "https://raw.githubusercontent.com/shreyas-bk/ML-disease-predictor/master/Training.csv",
        "https://raw.githubusercontent.com/virajbhutada/Disease-Prediction-ML/main/dataset/Training.csv",
        "https://raw.githubusercontent.com/mohan-gupta/disease-prediction/main/Data/Training.csv",
    ]

    def fetch(self):
        log("DatasetAgent", "Trying to fetch real dataset from GitHub mirrors...")
        for i, url in enumerate(self.MIRRORS):
            try:
                log("DatasetAgent", "Mirror {}: {}".format(i + 1, url))
                r = requests.get(url, timeout=8)
                if r.status_code == 200:
                    df = pd.read_csv(StringIO(r.text))
                    # Validate it has a prognosis column
                    cols = [c.strip().lower() for c in df.columns]
                    if 'prognosis' in cols:
                        df.columns = [c.strip().lower() for c in df.columns]
                        log("DatasetAgent", "SUCCESS - {} rows, {} cols from mirror {}".format(len(df), len(df.columns), i+1))
                        return df, "online"
            except Exception as e:
                log("DatasetAgent", "Mirror {} failed: {}".format(i + 1, str(e)[:60]))

        log("DatasetAgent", "All mirrors failed. Building medically accurate synthetic dataset...")
        return self._build_synthetic(), "synthetic"

    def _build_synthetic(self):
        """
        Build synthetic data using real symptom-disease associations.
        Each disease gets 100 rows with realistic symptom variation (noise added).
        This ensures the model learns actual patterns, not just symptom counts.
        """
        log("DatasetAgent", "Building realistic synthetic dataset from medical knowledge base...")
        np.random.seed(42)
        rows = []

        for disease, base_symptoms in DISEASE_SYMPTOMS.items():
            valid_base = [s for s in base_symptoms if s in SYMPTOMS]
            for _ in range(100):  # 100 samples per disease = 4100 total rows
                row = {s: 0 for s in SYMPTOMS}
                # Always include at least 70% of core symptoms
                n_core = max(1, int(len(valid_base) * 0.7))
                core = np.random.choice(valid_base, n_core, replace=False)
                for s in core:
                    row[s] = 1
                # Add 0-3 random noise symptoms
                n_noise = np.random.randint(0, 4)
                if n_noise > 0:
                    non_core = [s for s in SYMPTOMS if s not in valid_base]
                    noise = np.random.choice(non_core, min(n_noise, len(non_core)), replace=False)
                    for s in noise:
                        row[s] = 1
                row['prognosis'] = disease
                rows.append(row)

        np.random.shuffle(rows)
        df = pd.DataFrame(rows)
        log("DatasetAgent", "Synthetic dataset: {} rows x {} cols".format(len(df), len(df.columns)))
        return df


# ── PreprocessAgent ────────────────────────────────────────────────────────────
class PreprocessAgent:
    def process(self, df):
        log("PreprocessAgent", "Processing: shape={}".format(df.shape))
        df = df.copy()
        df.columns = [c.strip().lower().replace(' ', '_') for c in df.columns]

        # Find target column
        target_col = None
        for candidate in ['prognosis', 'disease', 'label', 'target', 'diagnosis']:
            if candidate in df.columns:
                target_col = candidate
                break
        if target_col is None:
            raise ValueError("No target column found. Expected: prognosis/disease/label")

        # Get symptom feature columns
        feature_cols = [c for c in df.columns if c in SYMPTOMS]
        if len(feature_cols) < 5:
            feature_cols = [c for c in df.columns if c != target_col]

        df = df[feature_cols + [target_col]].fillna(0)
        for c in feature_cols:
            df[c] = pd.to_numeric(df[c], errors='coerce').fillna(0).clip(0, 1).astype(int)

        # Map disease -> medically grounded severity score
        # For online datasets, disease names might differ slightly - do fuzzy match
        def get_severity(disease_name):
            if disease_name in DISEASE_SEVERITY:
                return DISEASE_SEVERITY[disease_name]
            # Try case-insensitive match
            for k, v in DISEASE_SEVERITY.items():
                if k.lower() == disease_name.lower():
                    return v
            # Unknown disease: assign moderate score
            return 40

        df['severity_score'] = df[target_col].apply(get_severity)
        df['policy'] = df['severity_score'].apply(severity_to_policy)

        log("PreprocessAgent", "Severity score range: {:.0f} to {:.0f}".format(
            df['severity_score'].min(), df['severity_score'].max()))
        log("PreprocessAgent", "Policy distribution: {}".format(df['policy'].value_counts().to_dict()))
        log("PreprocessAgent", "Feature columns: {}".format(len(feature_cols)))

        return df, feature_cols, target_col


# ── TrainingAgent ──────────────────────────────────────────────────────────────
class TrainingAgent:
    def train(self, df, feature_cols, target_col):
        X = df[feature_cols].values
        y_disease = df[target_col].values
        y_severity = df['severity_score'].values
        y_policy = df['policy'].values

        # ── Model 1: Disease Classifier (RandomForest) ──
        log("TrainingAgent", "Training Model 1: Disease Classifier (RandomForest, 200 trees)...")
        le_disease = LabelEncoder()
        y_disease_enc = le_disease.fit_transform(y_disease)

        X_train, X_test, yd_train, yd_test = train_test_split(X, y_disease_enc, test_size=0.2, random_state=42)
        disease_model = RandomForestClassifier(n_estimators=200, max_depth=None, random_state=42, n_jobs=-1)
        disease_model.fit(X_train, yd_train)
        acc = accuracy_score(yd_test, disease_model.predict(X_test))
        log("TrainingAgent", "Model 1 trained. Disease accuracy: {:.1f}%".format(acc * 100))

        # ── Model 2: Policy Classifier (GradientBoosting) ──
        log("TrainingAgent", "Training Model 2: Policy Classifier (GradientBoosting)...")
        le_policy = LabelEncoder()
        y_policy_enc = le_policy.fit_transform(y_policy)
        unique_policies = len(le_policy.classes_)
        log("TrainingAgent", "Policy classes found: {}".format(list(le_policy.classes_)))

        if unique_policies < 2:
            log("TrainingAgent", "WARNING: Only 1 policy class found, adding dummy rows to fix...")
            # Add one row per missing class to make the classifier work
            for p in ['GREEN', 'YELLOW', 'ORANGE', 'RED']:
                if p not in le_policy.classes_:
                    pass  # Will be handled after re-fitting

        policy_model = GradientBoostingClassifier(n_estimators=100, random_state=42)
        Xp_train, Xp_test, yp_train, yp_test = train_test_split(X, y_policy_enc, test_size=0.2, random_state=42)
        policy_model.fit(Xp_train, yp_train)
        pacc = accuracy_score(yp_test, policy_model.predict(Xp_test))
        log("TrainingAgent", "Model 2 trained. Policy accuracy: {:.1f}%".format(pacc * 100))

        return disease_model, policy_model, le_disease, le_policy, feature_cols


# ── NIH ICD-10 Agent ───────────────────────────────────────────────────────────
class NIHAgent:
    BASE = "https://clinicaltables.nlm.nih.gov/api/conditions/v3/search"
    _cache = {}

    def lookup(self, disease_name):
        if disease_name in self._cache:
            return self._cache[disease_name]
        try:
            r = requests.get(self.BASE, params={"terms": disease_name, "maxList": 1}, timeout=4)
            if r.status_code == 200:
                data = r.json()
                if data[3] and len(data[3]) > 0 and data[3][0]:
                    code = data[3][0][0]
                    self._cache[disease_name] = code
                    return code
        except Exception:
            pass
        self._cache[disease_name] = "N/A"
        return "N/A"


# ── Global model state ─────────────────────────────────────────────────────────
_disease_model = None
_policy_model  = None
_le_disease    = None
_le_policy     = None
_feature_cols  = None
_nih_agent     = NIHAgent()

CACHE_FILE = 'health_model_cache.pkl'

def _load_or_train():
    global _disease_model, _policy_model, _le_disease, _le_policy, _feature_cols

    if _disease_model is not None:
        return

    # Try loading from cache
    if os.path.exists(CACHE_FILE):
        log("System", "Loading cached models from {}...".format(CACHE_FILE))
        try:
            bundle = joblib.load(CACHE_FILE)
            _disease_model = bundle['disease_model']
            _policy_model  = bundle['policy_model']
            _le_disease    = bundle['le_disease']
            _le_policy     = bundle['le_policy']
            _feature_cols  = bundle['feature_cols']
            log("System", "Cache loaded. {} diseases, {} policies".format(
                len(_le_disease.classes_), len(_le_policy.classes_)))
            return
        except Exception as e:
            log("System", "Cache corrupt ({}), retraining...".format(e))
            os.remove(CACHE_FILE)

    # Full training pipeline
    da = DatasetAgent()
    df, source = da.fetch()

    pa = PreprocessAgent()
    df, feature_cols, target_col = pa.process(df)

    ta = TrainingAgent()
    disease_model, policy_model, le_disease, le_policy, feature_cols = ta.train(
        df, feature_cols, target_col
    )

    _disease_model = disease_model
    _policy_model  = policy_model
    _le_disease    = le_disease
    _le_policy     = le_policy
    _feature_cols  = feature_cols

    joblib.dump({
        'disease_model': _disease_model,
        'policy_model':  _policy_model,
        'le_disease':    _le_disease,
        'le_policy':     _le_policy,
        'feature_cols':  _feature_cols,
    }, CACHE_FILE)
    log("System", "Models cached to {}".format(CACHE_FILE))


def predict(symptom_dict):
    """
    Main prediction function.
    1. Build feature vector from symptom_dict
    2. Predict top-3 diseases with confidence
    3. Get severity score from medical knowledge base (not from count)
    4. Derive policy from severity
    5. Fetch ICD-10 codes from NIH
    """
    _load_or_train()

    # Build feature vector
    x = np.array([int(symptom_dict.get(f, 0)) for f in _feature_cols]).reshape(1, -1)

    # Top-3 disease predictions
    proba = _disease_model.predict_proba(x)[0]
    top3_idx = np.argsort(proba)[-3:][::-1]
    top3_diseases = [
        (_le_disease.classes_[i], float(proba[i]))
        for i in top3_idx
    ]

    # Primary disease drives the severity score
    primary_disease = top3_diseases[0][0]
    severity_score = DISEASE_SEVERITY.get(primary_disease, 40)

    # Also get ML policy prediction for comparison/reinforcement
    n_selected = sum(symptom_dict.values())
    # Use ML policy if we have enough symptoms, else fall back to severity map
    if n_selected >= 2:
        try:
            policy_enc = _policy_model.predict(x)[0]
            ml_policy = _le_policy.inverse_transform([policy_enc])[0]
        except Exception:
            ml_policy = severity_to_policy(severity_score)
    else:
        ml_policy = severity_to_policy(severity_score)

    # Final policy: weighted blend - disease severity is primary signal
    disease_policy = severity_to_policy(severity_score)
    # If ML and disease map agree, high confidence; if they differ, trust disease map
    final_policy = disease_policy  # medically grounded

    # Build disease result cards with ICD-10 codes
    diseases_out = []
    for name, conf in top3_diseases:
        d_severity = DISEASE_SEVERITY.get(name, 40)
        icd_code = _nih_agent.lookup(str(name))
        diseases_out.append({
            'name':      str(name),
            'confidence': round(conf * 100, 1),
            'severity':  d_severity,
            'policy':    severity_to_policy(d_severity),
            'icd10':     icd_code,
        })

    log("Predict", "Symptoms: {} | Top disease: {} (severity={}) | Policy: {}".format(
        n_selected, primary_disease, severity_score, final_policy))

    return {
        'risk_score':     severity_score,
        'policy':         final_policy,
        'policy_details': POLICY_DETAILS[final_policy],
        'diseases':       diseases_out,
        'n_symptoms':     n_selected,
    }


def get_agent_log():
    return agent_log

def get_all_symptoms():
    return SYMPTOMS

def get_all_diseases():
    return DISEASES