import React, { useState } from 'react';

const Star = ({ onRatingChange }: { onRatingChange: (rating: number) => void }) => {
    const [rating, setRating] = useState(0);

    const handleStarClick = (index: number) => {
        const newRating = (index + 1) * 20; // คำนวณคะแนน โดยแต่ละดวงมีค่า 20
        setRating(newRating);
        onRatingChange(newRating); // ส่งค่ากลับไปที่ `CommentPage`
    };

    return (
        <div className="flex space-x-2">
            {[...Array(5)].map((_, index) => (
                <button
                    key={index}
                    onClick={() => handleStarClick(index)}
                    className={`text-3xl ${rating >= (index + 1) * 20 ? 'text-yellow-400' : 'text-gray-400'}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

export default Star;
