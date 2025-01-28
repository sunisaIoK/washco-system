'use client';

// import { useSession } from 'next-auth/react';
import React from 'react';

interface AddressSelectionProps {
  formData: {
    hotelName: string;
    roomNumber: string;
    additionalDetails: string;
    name: string;
    phone: string;
  };
  onAddressChange: (data: {
    hotelName: string;
    roomNumber: string;
    additionalDetails: string;
    name: string;
    phone: string;
  }) => void;
}

const AddressSelection: React.FC<AddressSelectionProps> = ({ formData, onAddressChange }) => {
  // const { data: session } = useSession();/
  // const user = session?.user; // ข้อมูลผู้ใช้จาก session

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onAddressChange({ ...formData, [name]: value });
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-3xl mt-3 mb-9">
      <div>
      <div>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium mb-1">
              ชื่อผู้จอง:
              {/* {user && <span className="text-black text-lg font-bold"> {user.email?.split('@')[0]}</span>} */}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="ระบุชื่อผู้ติดต่อ"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block font-medium mb-1">
              เบอร์โทรศัพท์:
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="เช่น 0812345678"
            />
          </div>
        </div>
        <div>
          <div className="mb-4">
            <label htmlFor="hotelName" className="block font-medium mb-1 mt-4">
              ชื่อโรงแรมหรือที่อยู่:
            </label>
            <input
              type="text"
              id="hotelName"
              name="hotelName"
              value={formData.hotelName}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="เช่น โรงแรม ABC"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="roomNumber" className="block font-medium mb-1">
              หมายเลขห้อง:
            </label>
            <input
              type="text"
              id="roomNumber"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="เช่น 101"
            />
          </div>
          <div>
            <label htmlFor="additionalDetails" className="block font-medium mb-1">
              รายละเอียดเพิ่มเติม:
            </label>
            <textarea
              id="additionalDetails"
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="เพิ่มรายละเอียดที่เกี่ยวกับที่อยู่"
            >
            </textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSelection;
