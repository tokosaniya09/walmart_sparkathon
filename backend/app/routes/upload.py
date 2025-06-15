from fastapi import APIRouter, File, UploadFile, Form

router = APIRouter()

@router.post("/upload")
async def upload_file (
    image: UploadFile = File(...),
    text: str = Form(...)
): 
    return {"message": "Received image and text"}