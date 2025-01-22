'use client'
import { Icon } from '@iconify/react'
import React, { useState } from 'react'



const Star = () => {
    const [rating, setRating] = useState<number>(0)
    const handleClick = (index: number) => {
        setRating(rating === index + 1 ? 0 : index + 1);
    }

    return (
        <>
            <div style={{ display: 'flex', cursor: 'pointer' }}>
                {[...Array(5)].map((_, index) => (
                    <Icon
                        key={index}
                        icon="mdi:star"
                        color={index < rating ? '#ffd700' : '#d3d3d3'}
                        width="30"
                        onClick={() => handleClick(index)}
                    />
                ))}
            </div>
        </>
    )
}

export default Star