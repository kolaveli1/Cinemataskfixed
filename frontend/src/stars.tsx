import React, { useEffect, useState } from "react";


interface StarStyle {
    top: string;
    left: string;
    animation: string;
}

const starStyle = () => {
    const top = Math.random() * 100;
    const left = Math.random() * 100;

    return {
        top: `${top}%`,
        left: `${left}%`,
        animation: `float 10s ease-in-out infinite`
    };
};

interface StarField{
    numberOfStars: number;
}


const Stars: React.FC<StarField> = ({numberOfStars}) => {
    const [stars, setStars] = useState<StarStyle[]>([]);

    useEffect(() => {
        const newStars = Array.from({length: numberOfStars}, starStyle);
        setStars(newStars);
    }, [numberOfStars]);

    return(
        <div className="fixed top-0 left-0 w-screen h-screen z-0">
            {stars.map((style, index) => (
                <div key={index} style={style} className="absolute w-0.5 h-0.5 bg-white rounded-full z-10"></div>
            ))}
        </div>
    );
};

export default Stars;