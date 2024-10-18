/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';


export default function CameraView(){
    const videoRef = useRef(null)
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState(null);

    //Function to start the camera
    const startCamera = async () => {
        try{
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280},
                    height : {ideal: 720},
                    facingMode : 'user'
                }
            });

            if (videoRef.current){
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
                setError(null);
            }
        }catch (err) {
            setError("Failed to access camera. Please ensure you have granted camera permissions. ");
            console.erro('Error accessing camera: ', err);
        }
    };
    // Stop the camera stream
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject){
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsStreaming(false);
        }
    };

    // Cleanup the component unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);


    return(
        <div className = "p-4 max-w-2xl mx-auto">
            <div className = "space-y-4">
                { error && (
                    <div className = "p-4 text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}
            
            <div className = "relative rounded-lg overflow-hidden bg-gray-900">
                <video
                    ref = {videoRef}
                    autoPlay
                    playsInline
                    muted
                    className = "w-full h-[480px] object-cover"
                />
            </div>

            <button
                onClick = {isStreaming ? stopCamera : startCamera}
                className = "flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                <Camera size = {20} />
                {isStreaming? 'Stop Camera' : 'Start Camera'}
            </button>
        </div>
    </div>
    );
}


