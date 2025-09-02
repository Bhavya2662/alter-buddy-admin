import React from "react";
import { Layout } from "../../layout";
import { Link, useNavigate } from "react-router-dom";
import { useGetAllMentorQuery, useGetAllUserQuery } from "../../app/api";
import { FaChalkboardTeacher, FaCircle, FaCheckCircle } from 'react-icons/fa';
import {AiOutlineUser} from 'react-icons/ai';
import Chart from 'react-apexcharts';

const chartConfig = {
  type: "bar",
  height: 300,
  series: [
    {
      name: "Sales",
      data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
    },
  ],
  options: {
    chart: {
      toolbar: { show: false },
      background: "transparent",
    },
    dataLabels: { enabled: false },
    colors: ["#ef4444"], // slate-900
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: {
        style: {
          colors: "black", // text-gray-400
          fontSize: "14px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "black",
          fontSize: "14px",
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#8b8d91", // gray-700
      strokeDashArray: 5,
      xaxis: {
        lines: { show: true },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: "dark",
    },
  },
};


export const DashboardPage = () => {
  const { data: user } = useGetAllUserQuery();
  const { data: mentor } = useGetAllMentorQuery();
  const navigate = useNavigate();
  return (
    <Layout pageTitle="Dashboard">
      <div className="grid grid-cols-12 gap-5  mt-24">
        <div onClick={() => navigate('/users/manage')} className="col-span-12 cursor-pointer border-[2px] xl:col-span-3  rounded-xl p-4 hover:shadow-xl">
          <p className="text-xl font-medium">User Engagement</p>
          <div className="flex my-4 px-5 items-center justify-between">
          <h6 className="text-4xl text-[#ef4444] font-semibold">{user?.data.length}</h6>
          <AiOutlineUser  size={44} color="#ef4444" />
          </div>
          {/* <hr className="my-1 border-black" /> */}
          
        </div>
        <div onClick={() => navigate('/mentors/manage')}  className="col-span-12 cursor-pointer border-[2px] xl:col-span-3  rounded-xl p-4 hover:shadow-xl">
          <p className="text-xl font-medium">Mentor Registered</p>
          <div className="flex my-4 px-5 items-center justify-between">
          <h6 className="text-4xl mt-2 text-[#ef4444] font-semibold">{mentor?.data.length}</h6>
          <FaChalkboardTeacher size={50} color="#ef4444" />
          </div>
          {/* <hr className="my-1 border-black" /> */}
        </div>
        <div onClick={() => navigate('/mentors/manage')} className="col-span-12 cursor-pointer border-[2px] xl:col-span-3  rounded-xl p-4 hover:shadow-xl">
          <p className="text-xl font-medium">Verified Mentors</p>
          <div className="flex my-2 px-5 items-center justify-between">
          <h6 className="text-4xl mt-4 text-[#ef4444] font-semibold"> {
              mentor?.data.filter(
                (mentor) => mentor.accountStatus.verification === true
              ).length
            }</h6>
          <div>
          <FaChalkboardTeacher className="mt-4" size={50} color="#ef4444" />
          <FaCheckCircle size={18} color="#ef4444" style={{ marginLeft: 36, marginTop: -19 }} />
          </div>
          </div>
          {/* <hr className="my-1 border-black" /> */}
         
        </div>
        <div onClick={() => navigate('/users/manage')} className="col-span-12 cursor-pointer border-[2px] xl:col-span-3  rounded-xl p-4 hover:shadow-xl">
          <p className="text-xl font-medium">Current Online Users</p>
            <div className="flex my-2 px-5 items-center justify-between">
          <h6 className="text-4xl mt-4 text-[#ef4444] font-semibold"> {
              user?.data?.filter(
                (u) => u.online === true).length
            }</h6>
          <div>
          <AiOutlineUser className="mt-4" size={44} color="#ef4444" />
          <FaCircle size={13} color="#ef4444" style={{ marginLeft: 30, marginTop: -12 }}/>
          </div>
          </div>
          {/* <hr className="my-1 border-black" /> */}
          
        </div>
      </div>
      <hr className="my-5" />
      {/* <div className="grid grid-cols-12 gap-5 mb-20">
        <div className="col-span-12 xl:col-span-6 border-brandPrimary-500 rounded-md md:col-span-6  lg:col-span-6 sm:col-span-12">
          <div className="border p-3">
            <div className="flex items-center gap-3">
              <h6 className="text-2xl capitalize">recently joined doctors</h6>
            </div>
          </div>
        </div>
      </div> */}

      {/*Graph*/}
      <div className="bg-white rounded-xl p-5 shadow-md text-white">
      {/* Header */}
      {/* <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
       
        <div>
          <h2 className="text-xl text-black font-semibold">Statistics</h2>
          <p className="text-gray-500 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quaerat fuga voluptas!
          </p>
        </div>
      </div> */}

      {/* Chart */}
      <div className="-mt-4">
        <Chart options={chartConfig.options}
  series={chartConfig.series}
  type="bar"
  height={300} />
      </div>
    </div>
  
    </Layout>
  );
};
