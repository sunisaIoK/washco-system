'use client';

import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';

interface DetailField {
  fieldName: string;
  fieldValue: string;
}

interface Detail {
  id: string;
  nameDetail: string;
  fields: DetailField[];
  price: string;
  isActive: boolean;
}

const DetailData = () => {
  const [details, setDetails] = useState<Detail[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<Detail | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const itemsPerPage = 5; // จำนวนรายการต่อหน้า
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบันสำหรับตาราง "กำลังซักรีด"

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data/detail', { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to fetch details');
      }
      const { details } = await response.json();
      setDetails(details || []);
    } catch (err) {
      console.error('Error fetching details:', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails(); // Fetch details when the component is mounted
  }, []);

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      setLoading(true);
      const response = await fetch('/api/data/detail', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !isActive }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      await fetchDetails(); // Reload data after updating status
      alert('เปลี่ยนสถานะเรียบร้อย');
    } catch (err) {
      console.error('Error toggling status:', err);
      alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('คุณแน่ใจหรือไม่ว่าจะลบรายการนี้?');
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const response = await fetch('/api/data/detail', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('การลบข้อมูลไม่สำเร็จ');

      await fetchDetails(); // Reload data after deletion
      alert('ลบข้อมูลเรียบร้อย');
    } catch (error) {
      console.error('Error deleting detail:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedDetail) return;

    try {
      setIsSaving(true);
      const validFields = selectedDetail.fields.filter(
        (field) => field.fieldName.trim() && field.fieldValue.trim()
      );

      const response = await fetch('/api/data/detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedDetail,
          fields: validFields,
        }),
      });

      if (!response.ok) throw new Error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');

      await fetchDetails(); // Reload data after saving
      alert('บันทึกข้อมูลสำเร็จ');
      closeModal();
    } catch (error) {
      console.error('Error saving detail:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSaving(false);
    }
  };

  const openViewModal = (detail: Detail) => {
    setSelectedDetail(detail);
    setIsViewModalOpen(true);
  };

  const openEditModal = (detail: Detail) => {
    setSelectedDetail(detail);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDetail(null);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
  };

  const sortedOrders = details.sort((a, b) => a.nameDetail.localeCompare(b.nameDetail, 'th'));
  console.log(sortedOrders);
  const activeDetails = details.filter(() => details);
 // ฟังก์ชันคำนวณหน้า
 const indexOfLastItem = currentPage * itemsPerPage;
 const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 const currentDetails = details.slice(indexOfFirstItem, indexOfLastItem);
  // เปลี่ยนหน้า
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <main className="p-7 mr-40 ml-24">
      <div className="mb-4 flex justify-between items-center ">
        <h1 className="text-2xl font-bold">จัดการข้อมูลรายละเอียด</h1>
        <a href="/page/data/detail/createDetail">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            เพิ่มรายละเอียด
          </button>
        </a>
      </div>
      {error && <div className="text-red-500 my-4">{error}</div>}
      {loading ? (
        // Skeleton for loading
        <div className="flex justify-center mt-6 space-y-4 animate-pulse items-center">
          <div className=' border border-gray-200 p-4 shadow-sm rounded-md'>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">ชื่อรายละเอียด</th>
                  <th className="border px-4 py-2">ราคา</th>
                  <th className="border px-4 py-2">สถานะ</th>
                  <th className="border px-4 py-2">ดูข้อมูล</th>
                  <th className="border px-4 py-2">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center animate-pulse">
                  <td className="border px-4 py-2 ">&nbsp;</td>
                  <td className="border px-4 py-2 ">&nbsp;</td>
                  <td className="border px-4 py-2 ">&nbsp;</td>
                  <td className="border px-4 py-2 ">
                    <div
                      className="flex items-center justify-center space-x-6 border border-gray-200 p-4 shadow-sm rounded-md"
                    >
                    </div>
                  </td>
                  <td className="px-4 py-2 md:flex-row">
                    <div
                      className="flex items-center justify-center space-x-6 "
                    >
                      <div
                        className="flex items-center justify-center space-x-6 border border-gray-200 p-4 shadow-sm rounded-md"
                      >
                      </div>
                      <div
                        className="flex items-center justify-center space-x-6 border border-gray-200 p-4 shadow-sm rounded-md"
                      >
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          {activeDetails.length > 0 && (
            <span className="text-blue-800 text-sm " >
              พบรายละเอียดทั้งหมด: {activeDetails.length} รายการ
            </span>
          )}
          <table className="w-full border-collapse border mt-2 border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 text-xl">
                <th className="border px-4 py-2">ชื่อรายละเอียด</th>
                <th className="border px-4 py-2">ราคา</th>
                <th className="border px-4 py-2">สถานะ</th>
                <th className="border px-4 py-2">ดูข้อมูล</th>
                <th className="border px-4 py-2">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {currentDetails.map((detail) => (
                <tr key={detail.id} className="bg-white text-center text-lg even:bg-gray-50 hover:bg-gray-100">
                  {/* ชื่อรายละเอียด */}
                  <td className="border px-4 py-2">{detail.nameDetail}</td>
                  {/* ราคา */}
                  <td className="border px-4 py-2">{detail.price} บาท</td>
                  {/* สถานะ */}
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => toggleStatus(detail.id, detail.isActive)}
                      className={`px-4 py-1 rounded ${detail.isActive
                        ? "hover:bg-green-600 hover:text-white text-green-700  bg-green-200"
                        : "hover:bg-red-600 hover:text-white text-red-700  bg-red-200"
                        }`}
                    >
                      {detail.isActive ? 'เปิด' : 'ปิด'}
                    </button>
                  </td>
                  {/* ดูข้อมูล */}
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => openViewModal(detail)}
                      className="bg-blue-200 text-blue-500 px-3 py-1 rounded hover:bg-blue-300 hover:text-blue-600"
                    >
                      ดูข้อมูล
                    </button>
                  </td>
                  {/* การจัดการ */}
                  <td className="border px-4 py-2 gap-2 ">
                    <button
                      onClick={() => openEditModal(detail)}
                      className="bg-yellow-400 text-white hover:text-white px-2 py-2 mr-1 rounded hover:bg-yellow-500"
                    >
                      <Icon icon="mdi:pencil" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(detail.id)}
                      className="bg-red-500 text-white px-2 py-2 rounded ml-1 hover:text-white hover:bg-red-600"
                    >
                      <Icon icon="mdi:trash-can-outline" className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(details.length / itemsPerPage) }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 border-blue-500"
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Modal for Viewing */}
      {isViewModalOpen && selectedDetail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">ข้อมูลรายละเอียด</h2>
            <div className="mb-4">
              <p className="font-semibold">หัวข้อรายละเอียด:</p>
              <p className="bg-gray-100 px-3 py-2 rounded">{selectedDetail.nameDetail}</p>
            </div>
            <div className="mb-4">
              <p className="font-semibold">รายการ:</p>
              <ul>
                {selectedDetail.fields.map((field, index) => (
                  <li key={index}>
                    {field.fieldValue}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <p className="font-semibold">ราคา:</p>
              <p className="bg-gray-100 px-3 py-2 rounded">{selectedDetail.price} บาท/กิโลกรัม</p>
            </div>
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* Modal for Editing */}
      {isEditModalOpen && selectedDetail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">แก้ไขข้อมูล</h2>
            <form>
              <div className="mb-4">
                <label className="block font-semibold mb-2">หัวข้อรายละเอียด:</label>
                <input
                  type="text"
                  value={selectedDetail.nameDetail}
                  onChange={(e) =>
                    setSelectedDetail({
                      ...selectedDetail,
                      nameDetail: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">ราคา:</label>
                <input
                  type="number"
                  value={selectedDetail.price}
                  onChange={(e) =>
                    setSelectedDetail({
                      ...selectedDetail,
                      price: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">รายการ:</label>
                {selectedDetail.fields.map((field, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-center">
                    <input
                      type="text"
                      value={field.fieldValue}
                      onChange={(e) => {
                        const updatedFields = [...selectedDetail.fields];
                        updatedFields[index].fieldValue = e.target.value;
                        setSelectedDetail({ ...selectedDetail, fields: updatedFields });
                      }}
                      className="flex-1 border px-3 py-2 rounded"
                      placeholder="ค่าฟิลด์"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedFields = selectedDetail.fields.filter((_, i) => i !== index);
                        setSelectedDetail({ ...selectedDetail, fields: updatedFields });
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    if (
                      selectedDetail.fields.some(
                        (field) => field.fieldName === '' || field.fieldValue === ''
                      )
                    ) {
                      alert('กรุณากรอกข้อมูลให้ครบถ้วนก่อนเพิ่มฟิลด์ใหม่');
                      return;
                    }

                    const newField = { fieldName: '', fieldValue: '' };
                    const updatedFields = [...selectedDetail.fields, newField];
                    setSelectedDetail({ ...selectedDetail, fields: updatedFields });
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
                >
                  เพิ่มฟิลด์
                </button>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  disabled={isSaving}
                >
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default DetailData;