'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

interface Service {
  id: string;
  nameService: string;
  description: string;
  hour: number;
  price: number;
  isActive: boolean;
}

const ServiceData = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempService, setTempService] = useState<Partial<Service>>({});

  // Fetch all services from the server
  const fetchServices = async () => {
    try {
      setLoading(true); // Start loading
      const response = await fetch('/api/data/service', { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const { services } = await response.json();
      setServices(services || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchServices(); // Load services when the component is mounted
  }, []);

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      setLoading(true); // Start loading
      const response = await fetch('/api/data/service', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !isActive }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      await fetchServices(); // Reload services after status update
      alert('เปลี่ยนสถานะเรียบร้อย');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
    }finally {
      setLoading(false);
    }
  };

  const saveEditing = async (id: string) => {
    try {
      setLoading(true); // Start loading
      const response = await fetch('/api/data/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...tempService }),
      });

      if (!response.ok) throw new Error('Failed to update service');

      await fetchServices(); // Reload services after saving
      alert('แก้ไขข้อมูลสำเร็จ');
      cancelEditing(); // Reset editing state
    } catch (err) {
      console.error('Error updating service:', err);
      alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const deleteService = async (id: string) => {
    const confirmDelete = confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?');
    if (!confirmDelete) return;

    try {
      setLoading(true); // Start loading
      const response = await fetch('/api/data/service', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete service');

      await fetchServices(); // Reload services after deletion
      alert('ลบข้อมูลสำเร็จ');
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const startEditing = (service: Service) => {
    setEditingId(service.id);
    setTempService({ ...service }); // Preload current data to temp state
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTempService({});
  };

  return (
    <main className="p-6 mb-72">
      <div className="mb-4 flex justify-between items-center mr-24 px-3 ml-24 pl-2">
        <h1 className="text-2xl font-bold ">จัดการข้อมูลบริการ</h1>
        <a href="/page/data/service/createService">
          <button className="bg-blue-500 hover:bg-blue-600 ml-72  text-white px-4 py-2 rounded flex items-center">
            <Icon icon="ph:plus-bold" className="mr-2" />
            เพิ่มบริการ
          </button>
        </a>
      </div>
      {error && (
        <p className="text-red-500 mb-4 flex justify-center">{error}</p>
      )}
      {
        loading ? (
          // Skeleton Loader while loading
          <div className="space-y-4 animate-pulse flex justify-center items-center p-2">
            <div className="w-5/12 border border-gray-200 p-4 shadow-sm rounded-md">
              <table className="table-auto w-full border-collapse border border-gray-300 mt-5">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">ชื่อบริการ</th>
                    <th className="border px-4 py-2">รายละเอียด</th>
                    <th className="border px-4 py-2">ชั่วโมง</th>
                    <th className="border px-4 py-2">ราคา</th>
                    <th className="border px-4 py-2">สถานะ</th>
                    <th className="border px-4 py-2">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center animate-pulse">
                    <td className="border px-4 py-2 ">&nbsp;</td>
                    <td className="border px-4 py-2 ">&nbsp;</td>
                    <td className="border px-4 py-2 ">&nbsp;</td>
                    <td className="border px-4 py-2 ">&nbsp;</td>
                    <td className="border px-4 py-2 ">&nbsp;</td>
                    <td className="border px-4 py-2 md:flex-row">
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
          // Data table when loaded
          <div className="flex justify-center">
            <div className="w-10/12">
              <table className="table-auto w-full border-collapse border border-gray-300 mt-5">
                <thead>
                  <tr className="bg-gray-100  text-xl">
                    <th className="border px-4 py-2">ชื่อบริการ</th>
                    <th className="border px-4 py-2">รายละเอียด</th>
                    <th className="border px-4 py-2">ชั่วโมง</th>
                    <th className="border px-4 py-2">ราคา</th>
                    <th className="border px-4 py-2">สถานะ</th>
                    <th className="border px-4 py-2">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id} className="text-center  text-lg even:bg-gray-50 odd:bg-white hover:bg-gray-100">
                      {/* ชื่อบริการ */}
                      <td className="border px-4 py-2">
                        {editingId === service.id ? (
                          <input
                            type="text"
                            value={tempService.nameService || ""}
                            onChange={(e) =>
                              setTempService({
                                ...tempService,
                                nameService: e.target.value,
                              })
                            }
                            className="border px-2 py-1 w-full"
                          />
                        ) : (
                          service.nameService
                        )}
                      </td>
                      {/* รายละเอียด */}
                      <td className="border px-4 py-2">
                        {editingId === service.id ? (
                          <textarea
                            value={tempService.description || ""}
                            onChange={(e) =>
                              setTempService({
                                ...tempService,
                                description: e.target.value,
                              })
                            }
                            className="border px-2 py-1 w-full"
                          />
                        ) : (
                          service.description
                        )}
                      </td>
                      {/* ราคา */}
                      <td className="border px-4 py-2">
                        {editingId === service.id ? (
                          <input
                            type="number"
                            value={tempService.hour || ""}
                            onChange={(e) =>
                              setTempService({
                                ...tempService,
                                hour: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="border px-2 py-1 w-full"
                          />
                        ) : (
                          `${service.hour} ชั่วโมง`
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        {editingId === service.id ? (
                          <input
                            type="number"
                            value={tempService.price || ""}
                            onChange={(e) =>
                              setTempService({
                                ...tempService,
                                price: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="border px-2 py-1 w-full"
                          />
                        ) : (
                          `${service.price} บาท`
                        )}
                      </td>
                      {/* สถานะ */}
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => toggleStatus(service.id, service.isActive)}
                          className={`px-3 py-1 rounded ${service.isActive
                            ?  "bg-green-200 text-green-900"
                            :  "bg-red-100 text-red-800"
                            }`}
                        >
                          {service.isActive ? "เปิด" : "ปิด"}
                        </button>
                      </td>
                      {/* การดำเนินการ */}
                      <td className="border px-4 py-2">
                        {editingId === service.id ? (
                          <>
                            <button
                              onClick={() => saveEditing(service.id)}
                              className="text-green-500 hover:text-green-600 px-3 py-1 rounded mr-2"
                            >
                              <Icon icon="mdi:check-circle" className="w-5 h-5" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-red-500 hover:text-red-600 px-3 py-1 rounded"
                            >
                              <Icon icon="mdi:close-circle" className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(service)}
                              className="text-white bg-yellow-400 hover:text-white hover:bg-yellow-500 px-3 py-1 rounded mr-2"
                            >
                              <Icon icon="mdi:pencil" className="w-6 h-6" />
                            </button>
                            <button
                              onClick={() => deleteService(service.id)}
                              className="bg-red-500 text-white hover:text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                              <Icon icon="mdi:delete" className="w-6 h-6" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      }
    </main>
  );
};

export default ServiceData;