
'use client';
import React, { useEffect, useState } from 'react';

// สร้าง Type สำหรับ Comment
interface CommentType {
    id: string;
    name: string;
    description: string;
    rating: number;
}

const Comment = () => {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(true);

    // ดึงข้อมูลคอมเมนต์จาก API
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch('/api/data/comment', { method: 'GET' });
        
                const data = await response.json();
                setComments(data.Comments || []);
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, []);

    if (loading) {
        return <p className="text-center">กำลังโหลดข้อมูลความคิดเห็น...</p>;
    }

    if (comments.length === 0) {
        return <p className="text-center">ยังไม่มีความคิดเห็น</p>;
    }

    return (
        <div className="min-w-screen mb-9 mt-9">
            <div className="flex flex-col items-center justify-center mb-9 mt-9">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-9">
                    {comments.map((comment) => (
                        <div key={comment.id} className="w-60 h-80 bg-white rounded-lg shadow-md p-4 mb-9">
                            <div className="flex items-center mb-5 mt-5">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={30}
                                        height={30}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill={i < Math.floor(comment.rating / 20) ? '#FFCC00' : '#CCCCCC'} // สีเหลืองหรือสีเทา
                                            d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"
                                        ></path>
                                    </svg>
                                ))}
                            </div>
                            <p className="line-clamp-4 text-sm text-gray-600 mb-9 p-1">{comment.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Comment;

// const Comment = () => {
//     return (
//         <div className="min-w-screen mb-9 mt-9">
//             <div className="flex flex-col items-center justify-center mb-9 mt-9">
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-9">
//                     <div className="w-60 h-80 bg-white rounded-lg shadow-md p-4 mb-9 ">
//                         <div className="flex items-center mb-5 mt-5">
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                         </div>
//                         <p className="line-clamp-4 text-sm text-gray-600 mb-9 p-1">
//                             ประทับใจมากค่ะ เสื้อผ้าสะอาดหอม สดชื่น แถมงานรีดก็เรียบเนียบสุด ๆ มีบริการรับ-ส่งถึงบ้านตรงเวลา ทำให้ชีวิตสะดวกขึ้นเยอะเลยค่ะ
//                         </p>
//                         <div className="flex items-center mt-9 justify-items-end ">
//                             <div className="flex flex-col items-end mt-9 ">
//                                 <Image src="/assets/images/review/p1.jpg"
//                                     width={70}
//                                     height={10}
//                                     alt="User Image"
//                                     className="rounded-full" />
//                             </div>
//                             <p className="text-sm  ml-5 mt-9 p-5">เจสสิก้า</p>
//                         </div>
//                     </div>
//                     <div className="w-60 h-80 bg-white rounded-lg shadow-md p-4">
//                         <div className="flex items-center mb-5 mt-5">
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                         </div>
//                         <p className="line-clamp-4 text-sm text-gray-600 mb-9 p-1">
//                             ประทับใจมากค่ะ เสื้อผ้าสะอาดหอม สดชื่น แถมงานรีดก็เรียบเนียบสุด ๆ มีบริการรับ-ส่งถึงบ้านตรงเวลา ทำให้ชีวิตสะดวกขึ้นเยอะเลยค่ะ
//                         </p>
//                         <div className="flex items-center mt-9 justify-items-end ">
//                             <div className="flex flex-col items-end mt-9 ">
//                                 <Image src="/assets/images/review/p1.jpg"
//                                     width={70}
//                                     height={10}
//                                     alt="User Image"
//                                     className="rounded-full" />
//                             </div>
//                             <p className="text-sm  ml-5 mt-9 p-5">เจสสิก้า</p>
//                         </div>
//                     </div>
//                     <div className="w-60 h-80 bg-white rounded-lg shadow-md p-4">
//                         <div className="flex items-center mb-5 mt-5">
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                         </div>
//                         <p className="line-clamp-4 text-sm text-gray-600 mb-9 p-1">
//                             ประทับใจมากค่ะ เสื้อผ้าสะอาดหอม สดชื่น แถมงานรีดก็เรียบเนียบสุด ๆ มีบริการรับ-ส่งถึงบ้านตรงเวลา ทำให้ชีวิตสะดวกขึ้นเยอะเลยค่ะ
//                         </p>
//                         <div className="flex items-center mt-9 justify-items-end ">
//                             <div className="flex flex-col items-end mt-9 ">
//                                 <Image src="/assets/images/review/p1.jpg"
//                                     width={70}
//                                     height={10}
//                                     alt="User Image"
//                                     className="rounded-full" />
//                             </div>
//                             <p className="text-sm  ml-5 mt-9 p-5">เจสสิก้า</p>
//                         </div>
//                     </div>
//                     <div className="w-60 h-80 bg-white rounded-lg shadow-md p-4">
//                         <div className="flex items-center mb-5 mt-5">
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                             <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
//                                 <path fill="#FFCC00" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z">
//                                 </path>
//                             </svg>
//                         </div>
//                         <p className="line-clamp-4 text-sm text-gray-600 mb-9 p-1">
//                             ประทับใจมากค่ะ เสื้อผ้าสะอาดหอม สดชื่น แถมงานรีดก็เรียบเนียบสุด ๆ มีบริการรับ-ส่งถึงบ้านตรงเวลา ทำให้ชีวิตสะดวกขึ้นเยอะเลยค่ะ
//                         </p>
//                         <div className="flex items-center mt-9 justify-items-end ">
//                             <div className="flex flex-col items-end mt-9 ">
//                                 <Image src="/assets/images/review/p1.jpg"
//                                     width={70}
//                                     height={10}
//                                     alt="User Image"
//                                     className="rounded-full" />
//                             </div>
//                             <p className="text-sm  ml-5 mt-9 p-5">เจสสิก้า</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Comment;