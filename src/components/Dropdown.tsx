'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname() // ใช้เพื่อตรวจสอบ URL ปัจจุบัน

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    // ปิด Dropdown เมื่อ pathname เปลี่ยน
    setIsOpen(false)
  }, [pathname]) // ฟังการเปลี่ยนแปลงของ URL

  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '200px',
        }}
      >
        <button
          onClick={toggleDropdown}
          style={{
            color: '#fff',
            width: '40%',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
            textAlign: 'center',
            marginLeft: '100px',
          }}
          className='profile'
        >
          โปรไฟล์
        </button>

        {isOpen && (
          <ul
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              margin: 0,
              padding: 0,
              textAlign: 'center',
              listStyleType: 'none',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff',
              zIndex: 10,
            }}
          >
            {/* <li
              style={{
                padding: '10px',
                cursor: 'pointer',
                // borderBottom: '1px solid #eee',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className='ml-1'>
                <g fill="none" stroke="#0016bc">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2" />
                  <path d="M4.271 18.346S6.5 15.5 12 15.5s7.73 2.846 7.73 2.846M12 12a3 3 0 1 0 0-6a3 3 0 0 0 0 6" />
                </g>
              </svg>
              <Link href='/page/user' style={{ textDecoration: 'none', color: 'inherit' }} className='ml-2'>
                โปรไฟล์
              </Link>
            </li> */}
            <li
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 1200 1200" className='ml-1 '>
                <path fill="#0016bc" d="M600 0c-65.168 0-115.356 54.372-115.356 119.385c0 62.619-.439 117.407-.439 117.407h-115.87c-2.181 0-4.291.241-6.372.586h-32.227v112.573h540.527V237.378h-32.227c-2.081-.345-4.191-.586-6.372-.586H715.796s1.318-49.596 1.318-117.041C717.114 57.131 665.168 0 600 0M175.195 114.185V1200h849.609V114.185H755.64v78.662h191.382v928.345h-693.97V192.847H444.36v-78.662zM600 115.649c21.35 0 38.599 17.18 38.599 38.452c0 21.311-17.249 38.525-38.599 38.525s-38.599-17.215-38.599-38.525c0-21.271 17.249-38.452 38.599-38.452M329.736 426.27v38.525h38.599V426.27zm115.869.732v38.525h424.658v-38.525zm-115.869 144.58v38.525h38.599v-38.525zm115.869.732v38.599h424.658v-38.599zM329.736 716.895v38.525h38.599v-38.525zm115.869.805v38.525h424.658V717.7zM329.736 862.28v38.525h38.599V862.28zm115.869.806v38.525h424.658v-38.525zm-115.869 144.507v38.525h38.599v-38.525zm115.869.805v38.525h424.658v-38.525z" />
              </svg>
              <Link href='/page/user/history' style={{ textDecoration: 'none', color: 'inherit' }} className='ml-2'>
                ประวัติการจอง
              </Link>
            </li>
            <li
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className='ml-1'>
                <path fill="#0016bc" d="M5 18h4.24a1 1 0 0 0 .71-.29l6.92-6.93L19.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71V17a1 1 0 0 0 1 1m9.76-13.59l2.83 2.83l-1.42 1.42l-2.83-2.83ZM6 13.17l5.93-5.93l2.83 2.83L8.83 16H6ZM21 20H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2" />
              </svg>
              <Link href='/page/user/history/comment' style={{ textDecoration: 'none', color: 'inherit' }} className='ml-2'>
                แสดงความคิดเห็น
              </Link>
            </li>
            <li
              style={{
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onClick={() => signOut()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className='ml-1'>
                <path fill="#ea0000" d="M4 12a.5.5 0 0 0 .5.5h8.793l-2.647 2.646a.5.5 0 1 0 .707.708l3.5-3.5a.5.5 0 0 0 0-.707l-3.5-3.5a.5.5 0 0 0-.707.707l2.647 2.646H4.5a.5.5 0 0 0-.5.5M17.5 2h-11A2.5 2.5 0 0 0 4 4.5v4a.5.5 0 0 0 1 0v-4A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-4a.5.5 0 0 0-1 0v4A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 17.5 2" />
              </svg>
              <p className='ml-2 text-red-500'>
                ออกจากระบบ
              </p>
            </li>
          </ul>
        )}
      </div>
    </>
  )
}

export default Dropdown
