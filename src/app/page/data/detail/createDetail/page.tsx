'use client';

import { Icon } from '@iconify/react';
import React, { useState } from 'react';

interface Field {
  fieldName: string;
  fieldValue: string;
}

const CreateDetail = () => {
  const [nameDetail, setNameDetail] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fields, setFields] = useState<string[]>([]);

  // เพิ่มช่องใหม่
  const addField = () => {
    setFields([...fields, ""]);
  };

  // อัปเดตค่าช่อง input
  const updateField = (index: number, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index] = value;
    setFields(updatedFields);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const fieldsData: Field[] = fields.map((fieldValue, index) => ({
      fieldName: `field_${index + 1}`,
      fieldValue,
    }));

    try {
      const response = await fetch("/api/data/detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameDetail,
          fields: fieldsData,
          price,
          isActive,
        }),
      });

      if (!nameDetail || !fields || !price) {
        setError("กรุณากรอกข้อมูลให้ครบถ้วน");
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "การบันทึกล้มเหลว");
      }

      const result = await response.json();
      console.log("ผลการบันทึก:", result);
      setSuccess("บันทึกข้อมูลสำเร็จ");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      setError("เกิดข้อผิดพลาด");
    }
  };

  return (
    <main className="flex items-center justify-center h-screen md:flex-col" style={{ marginTop: "-5%"}}>
      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded-md shadow-md w-96"
      >
        <h1 className="text-center text-xl font-bold mb-6">เพิ่มรายละเอียด</h1>
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}
        {success && (
          <div className="text-green-500 text-center mb-4">{success}</div>
        )}
        {/* ชื่อบริการ */}
        <div className="mb-4">
          <label htmlFor="nameDetail" className="block font-medium mb-1">
            ชื่อรายละเอียด:
          </label>
          <input
            id="nameDetail"
            type="text"
            className="w-full border px-3 py-2 rounded-md focus:outline-primary"
            placeholder="ชื่อรายละเอียด"
            value={nameDetail}
            onChange={(e) => setNameDetail(e.target.value)}
            required
          />
        </div>
        {/* เพิ่มรายละเอียด */}
        <div className="mb-4">
          <label className="block font-medium mb-2">เพิ่มรายละเอียด:</label>
          {fields.map((field, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                className="w-full border px-3 py-2 rounded-md"
                value={field}
                placeholder={`เพิ่มรายละเอียด ${index + 1}`}
                onChange={(e) => updateField(index, e.target.value)}
              />
              <button
                type="button"
                className="text-red-500 hover:underline"
                onClick={() => setFields(fields.filter((_, i) => i !== index))}
              >
                ลบ
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addField}
            className="flex items-center text-blue-500 text-sm hover:underline"
          >
            <Icon icon="ph:plus" width={16} height={16} className="mr-1" /> เพิ่มช่อง
          </button>
        </div>
        {/* ราคา */}
        <div className="mb-4">
          <label htmlFor="price" className="block font-medium mb-1">
            ราคา:
          </label>
          <input
            id="price"
            type="number"
            className="w-full border mb-2 px-3 py-2 rounded-md"
            placeholder="ราคา"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          บาท
        </div>
        {/* เปิดใช้งานบริการ */}
        <div className="mb-6 flex items-center">
          <input
            id="isActive"
            type="checkbox"
            className="mr-2"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label htmlFor="isActive" className="text-md font-medium">
            เปิดใช้งานรายละเอียด
          </label>
          <style jsx>{`
                        input[type='checkbox'] {
                          appearance: none;
                          width: 1.25rem;
                          height: 1.25rem;
                          border: 1px solid #ccc;
                          border-radius: 0.25rem;
                          background-color: white;
                          transition: all 0.3s ease;
                          cursor: pointer;
                          position: relative;
                        }

                        input[type='checkbox']:checked {
                          background-color: #22c55e; /* สีเขียว */
                          border-color: #22c55e;
                        }

                        input[type='checkbox']:checked::after {
                          content: '✔';
                          position: absolute;
                          top: 0;
                          left: 0;
                          width: 100%;
                          height: 100%;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          font-size: 1rem;
                          color: white;
                        }
                      `}
            </style>
        </div>
        {/* ปุ่มบันทึก */}
        <div className="flex justify-center mb-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-1 py-2 rounded-md font-medium w-24 hover:bg-green-600"
            disabled={isLoading}
          >
            {isLoading ? "กำลังบันทึก" : "บันทึก"}
          </button>
        </div>
      </form>
      <div className="text-center ">
        <a href="/page/detail">
          <button className="bg-black text-white px-4 py-2 mt-8 rounded-md font-medium w-24">
            ย้อนกลับ
          </button>
        </a>
      </div>
    </main>
  );
};

export default CreateDetail;