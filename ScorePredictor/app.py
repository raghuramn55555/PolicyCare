import streamlit as st
import model

st.set_page_config(page_title="Health Risk Predictor", page_icon="🏥", layout="wide")

# Inject Custom CSS for Premium UI
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
    
    html, body, [class*="css"]  {
        font-family: 'Inter', sans-serif;
    }
    .main-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    .main-header h1 {
        font-weight: 800;
        background: -webkit-linear-gradient(45deg, #2563eb, #7c3aed);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 3rem;
    }
    .main-header p {
        color: #64748b;
        font-size: 1.1rem;
    }
    .stButton>button {
        width: 100%;
        background: linear-gradient(90deg, #2563eb, #3b82f6);
        color: white;
        font-weight: 600;
        border: none;
        padding: 0.75rem;
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
    }
    .metric-card {
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
        transition: transform 0.2s;
    }
    .metric-card:hover {
        transform: translateY(-2px);
    }
    .disease-bar {
        border-radius: 9999px;
        height: 0.75rem;
        transition: width 1s ease-in-out;
    }
</style>
""", unsafe_allow_html=True)

# Header Section
st.markdown("""
<div class="main-header">
    <h1>🏥 Health Risk Predictor</h1>
    <p>Select your symptoms below for an AI-powered diagnostic assessment.</p>
</div>
""", unsafe_allow_html=True)

# Main Form
st.markdown("### 📝 Patient Symptoms")
selected_symptoms = st.multiselect(
    "Search and select all applicable symptoms:", 
    options=model.SYMPTOMS,
    help="You can search by typing. Select as many as apply."
)

if st.button("Generate Diagnostic Report"):
    if not selected_symptoms:
        st.warning("⚠️ Please select at least one symptom to generate a report.")
    else:
        with st.spinner("🧠 Initializing Agentic AI... Analyzing complex patterns..."):
            symptom_dict = {s: 1 for s in selected_symptoms}
            
            try:
                # Call prediction model
                result = model.predict(symptom_dict)
                
                st.markdown("---")
                
                # Layout for Results
                col1, col_space, col2 = st.columns([1, 0.1, 1])
                
                with col1:
                    st.markdown("### 📊 Risk Assessment")
                    color = result['color']
                    st.markdown(f"""
                    <div class="metric-card" style="background: linear-gradient(135deg, {color}15, {color}05); border-left: 6px solid {color}; border-top: 1px solid {color}30; border-right: 1px solid {color}30; border-bottom: 1px solid {color}30;">
                        <h4 style="color: {color}; margin: 0; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px;">Risk Score</h4>
                        <h2 style="color: {color}; margin: 10px 0; font-size: 3rem; font-weight: 800;">{result['risk_score']}<span style="font-size:1.5rem">/100</span></h2>
                        <div style="display: inline-block; background-color: {color}; color: white; padding: 4px 12px; border-radius: 999px; font-weight: 600; font-size: 0.9rem;">
                            {result['label']}
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    st.markdown("### 👩‍⚕️ Recommended Action Plan")
                    st.info(f"**Primary Action:** {result['action']}")
                    
                    if result['recommendations']:
                        st.markdown("**Additional Steps:**")
                        for rec in result['recommendations']:
                            if rec != result['action']:
                                st.markdown(f"- {rec}")
                    
                with col2:
                    st.markdown("### 🔍 Most Likely Conditions")
                    
                    for idx, item in enumerate(result['top3_diseases']):
                        prob = item['prob']
                        # Set colors based on rank
                        bar_color = "#3b82f6" if idx == 0 else ("#6366f1" if idx == 1 else "#8b5cf6")
                        
                        st.markdown(f"""
                        <div class="metric-card" style="background-color: white; border: 1px solid #e2e8f0; padding: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <strong style="color: #1e293b; font-size: 1.1rem;">{item['disease']}</strong>
                                <span style="font-weight: 600; color: {bar_color};">{prob:.1f}%</span>
                            </div>
                            <div style="width: 100%; background-color: #f1f5f9; border-radius: 9999px; height: 0.75rem; overflow: hidden;">
                                <div class="disease-bar" style="width: {prob}%; background-color: {bar_color};"></div>
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
            except Exception as e:
                st.error(f"❌ An error occurred during prediction: {e}")