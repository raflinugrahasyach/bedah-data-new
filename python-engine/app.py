import gradio as gr
import uvicorn
from main import app as fastapi_app

def health_check():
    return "Bedah Data API Engine is Live and Running!"

# Gradio interface definition
demo = gr.Interface(
    fn=health_check,
    inputs=None,
    outputs="text",
    title="Bedah Data Statistical Microservice",
    description="Python FastAPI backend powering Bedah Data quantitative computations."
)

# Mount FastAPI app and Gradio interface together
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

if __name__ == "__main__":
    # Hugging Face Spaces strictly requires listening on 0.0.0.0:7860
    uvicorn.run(app, host="0.0.0.0", port=7860)
