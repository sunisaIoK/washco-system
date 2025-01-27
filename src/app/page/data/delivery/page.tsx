'use client';
import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';

interface Delivery {
  id: string;
  Delivery: string;
  descriptionDelivery: string;
  isActive: boolean; // สถานะเปิด/ปิดการทำงาน
}

const Delivery = () => {
  const [Delivery, setDelivery] = useState<Delivery[]>([]);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [newDelivery, setNewDelivery] = useState({ Delivery: '', descriptionDelivery: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5; // จำนวนรายการต่อหน้า
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบันสำหรับตาราง "กำลังซักรีด"

  const fetchDeliverys = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data/delivery', { method: 'GET' });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const { Deliverys } = await response.json();
      setDelivery(Deliverys || []);
    } catch (err) {
      console.error('Error fetching :', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliverys();
  }, []);

  const handleDelete = async (id: string) => {
    if (!id) {
      alert('ไม่มี ID ที่ต้องการลบ');
      return;
    }

    const confirmDelete = confirm('คุณแน่ใจหรือไม่ว่าจะลบรายการนี้?');
    if (!confirmDelete) return;

    try {
      const response = await fetch('/api/data/delivery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('การลบข้อมูลไม่สำเร็จ');
      }

      await fetchDeliverys();
      alert('ลบข้อมูลเรียบร้อย');
      setDelivery((prevDeliverys) => prevDeliverys.filter((Delivery) => Delivery.id !== id));
    } catch (error) {
      console.error('Error deleting :', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const handleAddDelivery = async () => {
    if (!newDelivery.Delivery || !newDelivery.descriptionDelivery) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      const response = await fetch('/api/data/delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDelivery,
          isActive: true, // ค่าเริ่มต้นเป็นเปิดใช้งาน
        }),
      });

      if (!response.ok) {
        throw new Error('การเพิ่มข้อมูลล้มเหลว');
      }

      const addedDelivery = await response.json();
      setDelivery(() => [...Delivery, addedDelivery]);
      await fetchDeliverys();
      alert('เพิ่มข้อมูลเรียบร้อย');
      // รีเซ็ตฟอร์มเพิ่มเดลิเวอรี่
      setNewDelivery({ Delivery: '', descriptionDelivery: '' });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding delivery:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
    }
  };

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/data/delivery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !isActive }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      await fetchDeliverys(); // Reload data after saving
      alert('เปลี่ยนสถานะเรียบร้อย');
      setDelivery((prevDeliverys) =>
        prevDeliverys.map((Delivery) =>
          Delivery.id === id ? { ...Delivery, isActive: !isActive } : Delivery
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
    }
  };

  const handleUpdateDelivery = async () => {
    if (!selectedDelivery) {
      alert('ไม่พบข้อมูลที่จะทำการแก้ไข');
      return;
    }

    try {
      const response = await fetch('/api/data/delivery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedDelivery),
      });

      if (!response.ok) {
        throw new Error('การแก้ไขข้อมูลล้มเหลว');
      }

      const updatedDelivery = await response.json();

      // อัปเดตรายการในหน้าจอ
      setDelivery(() =>
        Delivery.map((Delivery) =>
          Delivery.id === updatedDelivery.id ? updatedDelivery : Delivery
        )
      );
      await fetchDeliverys(); // Reload data after saving
      alert('แก้ไขข้อมูลเรียบร้อย');
      setIsModalUpdateOpen(false); // ปิด Modal หลังจากแก้ไขเสร็จ
    } catch (error) {
      console.error('Error updating delivery:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };
  const sortedOrders = Delivery.sort((a, b) => a.Delivery.localeCompare(b.Delivery, 'th'));
  console.log(sortedOrders);
  const activeDelivery = Delivery.filter(() => Delivery);
  // ฟังก์ชันคำนวณหน้า
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDeliveries = Delivery.slice(indexOfFirstItem, indexOfLastItem);

  // เปลี่ยนหน้า
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <main className="flex flex-col mr-12 ml-16 p-9">
      <div className="flex justify-between items-center ml-24 mr-2 mb-3">
        <h1 className="text-2xl font-bold">จัดการข้อมูลเดลิเวอรี่</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 mr-36 rounded flex items-center"
        >
          <Icon icon="ph:plus-bold" /> เพิ่มเดลิเวอรี่
        </button>
      </div>
      {error &&
        <div className="text-red-500">
          {error}
        </div>}
      <div className="p-4 flex flex-col md:flex-row items-center ">
        {/* โหลด Skeleton ระหว่างรอข้อมูล */}
        {loading ? (
          <div className="flex justify-center mt-6 space-y-4 animate-pulse items-center ml-72">
            <div className=' border border-gray-200 p-4 shadow-sm rounded-md'>
              <table className="w-full border-collapse border border-gray-300 ">
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
          <div className="overflow-x-auto ml-20">
            {activeDelivery.length > 0 && (
              <span className="text-blue-800 text-sm " >
                พบรายละเอียดทั้งหมด: {activeDelivery.length} รายการ
              </span>
            )}
            <table className=" table-auto border-collapse border border-gray-300 w-full ">
              <thead>
                <tr className="bg-gray-200 text-left ">
                  <th className="border border-gray-300 p-3 text-center">ชื่อบริการ</th>
                  <th className="border border-gray-300 p-3 text-center">รายละเอียด</th>
                  <th className="border border-gray-300 p-3 w-1/5 text-center">สถานะ</th>
                  <th className="border border-gray-300 p-3 w-1/5 text-center">การจัดการ</th>
                </tr>
              </thead>
              <tbody >
                {currentDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-100 even:bg-gray-50 bg-white">
                    <td className="border border-gray-300 p-3 text-center">{delivery.Delivery}</td>
                    <td className="border border-gray-300 p-3 text-center">{delivery.descriptionDelivery}</td>
                    <td className="border border-gray-300 p-3 text-center">
                      <button
                        onClick={() => toggleStatus(delivery.id, delivery.isActive)}
                        className={`px-3 py-1  rounded ${delivery.isActive
                          ? 'bg-green-200 text-green-800 hover:text-white  hover:bg-green-600 '
                          : 'bg-red-200 text-red-800 hover:bg-red-600 hover:text-white'}`}
                      >
                        {delivery.isActive ? 'เปิด' : 'ปิด'}
                      </button>
                    </td>
                    <td className="border border-gray-300 p-3 space-x-2 text-center">
                      <button
                        onClick={() => {
                          setSelectedDelivery(delivery); // เซ็ตข้อมูลที่เลือก
                          setIsModalUpdateOpen(true); // เปิด Modal
                        }}
                        className="bg-yellow-400 text-white hover:text-white hover:bg-yellow-500 px-3 py-1 rounded"
                      >
                        <Icon icon="mdi:pencil" className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => handleDelete(delivery.id)}
                        className="bg-red-500 text-white hover:text-white hover:bg-red-600 px-3 py-1 rounded"
                      >
                        <Icon icon="mdi:delete" className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex justify-center mt-4">
              {Array.from({ length: Math.ceil(Delivery.length / itemsPerPage) }, (_, index) => (
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
      </div>
      {/* Modal สำหรับแก้ไขเดลิเวอรี่ */}
      {/* Modal สำหรับแก้ไขเดลิเวอรี่ */}
      {isModalUpdateOpen && selectedDelivery && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">แก้ไขข้อมูลเดลิเวอรี่</h2>
            <form>
              <div className="mb-4">
                <label className="block font-semibold mb-2">ชื่อบริการ:</label>
                <input
                  type="text"
                  value={selectedDelivery.Delivery}
                  onChange={(e) =>
                    setSelectedDelivery({ ...selectedDelivery, Delivery: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">รายละเอียด:</label>
                <textarea
                  value={selectedDelivery.descriptionDelivery}
                  onChange={(e) =>
                    setSelectedDelivery({
                      ...selectedDelivery,
                      descriptionDelivery: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalUpdateOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    // ฟังก์ชันสำหรับบันทึกข้อมูล
                    await handleUpdateDelivery();
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )} {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <form>
              <div className="mb-4">
                <label className="block font-semibold mb-2">ชื่อบริการ:</label>
                <input
                  type="text"
                  value={newDelivery.Delivery}
                  onChange={(e) =>
                    setNewDelivery((prev) => ({ ...prev, Delivery: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">รายละเอียด:</label>
                <textarea
                  value={newDelivery.descriptionDelivery}
                  onChange={(e) =>
                    setNewDelivery((prev) => ({
                      ...prev,
                      descriptionDelivery: e.target.value,
                    }))
                  }
                  className="w-full border px-3 py-2 rounded"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleAddDelivery}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">เพิ่มเดลิเวอรี่</h2>
            <form>
              <div className="mb-4">
                <label className="block font-semibold mb-2">ชื่อบริการ:</label>
                <input
                  type="text"
                  value={newDelivery.Delivery}
                  onChange={(e) =>
                    setNewDelivery((prev) => ({ ...prev, Delivery: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">รายละเอียด:</label>
                <textarea
                  value={newDelivery.descriptionDelivery}
                  onChange={(e) =>
                    setNewDelivery((prev) => ({
                      ...prev,
                      descriptionDelivery: e.target.value,
                    }))
                  }
                  className="w-full border px-3 py-2 rounded"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleAddDelivery}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Delivery;