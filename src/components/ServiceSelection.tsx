'use client';

import React from 'react';

interface ServiceData {
  id: string;
  nameService: string;
  description: string;
  hour: number;
  price: number;
  isActive: boolean;
}

interface ServiceSelectionProps {
  selectedService: ServiceData | null;
  onSelectService: (service: ServiceData) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  selectedService,
  onSelectService,
}) => {
  const [services, setServices] = React.useState<ServiceData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // ดึงข้อมูลบริการจาก API
  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/data/booking', { method: 'GET' });
        if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลได้');
        const { serviceData } = await response.json();
        setServices(serviceData || []);
      } catch (err) {
        console.error(err);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const activeServices = services.filter((service) => service.isActive);

  return (
    <div className="p-6 bg-white rounded-3xl shadow-xl h-auto">
      {loading ? (
        <div className="flex flex-col md:col-span-3 space-y-4 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/3">&nbsp;</div>
          <div className="h-4 bg-gray-300 rounded w-full">&nbsp;</div>
          <div>
            <div className="text-center">
              <h3 className="text-lg bg-gray-300 rounded font-semibold">&nbsp;</h3>
              <p className="text-sm bg-gray-300 rounded text-gray-600 mt-2">&nbsp;</p>
              <p className="text-base bg-gray-300 rounded font-medium text-gray-800 mt-2">&nbsp;</p>
            </div>
          </div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : activeServices.length === 0 ? (
        <p>ไม่มีบริการที่พร้อมใช้งาน</p>
      ) : (
        <div className="grid grid-cols-2 gap-9 mt-1 p-6">
          {activeServices.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className={`border-b-2 cursor-pointer transition-all p-1 shadow-lg duration-300 rounded-lg  
                ${selectedService?.id === service.id
                  ? 'border-blue-700 border rounded hover:shadow-md'
                  : 'rounded-lg shadow-lg bg-white hover:border-blue-700 hover:shadow-lg'}`}
            >
              <div className="">
                <h3 className="text-sm font-bold text-blue-800">{service.nameService}</h3>
                <div className="text-right flex -mt-8 justify-end" >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 21 21"
                    className="rounded-3xl cursor-pointer"
                    style={{
                      backgroundColor: selectedService?.id === service.id ? "#283593" : "#D3D3D3", // เปลี่ยนสีพื้นหลัง
                      color: selectedService?.id === service.id ? "#FFFFFF" : "#fff", // เปลี่ยนสีข้อความเพื่อให้ตัดกัน
                    }}
                  >
                    <g
                      fill="none"
                      className='cursor-pointer'
                      stroke={selectedService?.id === service.id
                        ? "#D3D3D3"
                        : "#fff"} // เปลี่ยนสี stroke ตามสถานะที่เลือก
                    >
                      <path d="M14.857 3.79a8 8 0 1 0 2.852 3.24" />
                      <path d="m6.5 9.5l3 3l8-8" />
                    </g>
                  </svg>
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-base font-medium justify-start text-gray-800">
                    <p className="text-sm text-gray-600">
                      {service.description} {service.hour} ชั่วโมง
                    </p>
                    <p className="flex flex-col text-sm text-gray-600 flex ">
                      บริการรับ-ส่งฟรี
                    </p>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    <div className="flex text-base font-medium text-gray-800 -mt-11 ml-64">
                      <p className="text-xs text-blue-800 -mt-1">
                        ฿
                      </p>
                      <p className='font-bold text-xl text-blue-800 border-b-2'>
                        {service.price}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
