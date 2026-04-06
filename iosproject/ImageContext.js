import React, {createContext, useState, useContext} from "react";

const ImageContext = createContext();

export const ImageProvider = ({children}) => {
    const [userImages, setUserImages] = useState({});

    const saveImageUser = (userId, imageUri) => {
        setUserImages(prev => ({...prev, [userId]: imageUri}))
    }

    const logout = () => {
        setUserImages({});
    }

    return (
        <ImageContext.Provider value={{ userImages, saveImageUser, logout}} >
            {children}
        </ImageContext.Provider>
    )
}

export const useImageContext = () => {
    const context = useContext(ImageContext);
    if (!context) {
        console.log('error')
    }
    return context
}