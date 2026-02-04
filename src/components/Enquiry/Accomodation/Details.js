"use client";
import React, { useEffect, useState } from "react";
import Inputfield from "@/components/TextInput";
import {
  fetchAccomodationDetailsByEmail,
  fetchAccomodationRegister,
  fetchMasterAccommodation,
  fetchUserByEmail,
} from "../../../API/call";
import Dropdown from "@/components/Dropdown";
import { useRouter } from "next/navigation";
import { fetchPaymentDetailsByEmail } from "../../../API/call";
import { IoIosArrowForward } from "react-icons/io";
import Toggle from "@/components/Toggle";
import { FiCheck } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

function Details() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    kriyaId: "",
    college: "",
    residentialAddress: "",
    city: "",
    phone: "",
    gender: "Male",
    roomType: "",
    from: "14th March Morning",
    to: "16th March Evening",
    breakfast1: false,
    breakfast2: false,
    breakfast3: false,
    dinner1: false,
    dinner2: false,
    days: 0,
    amount: 0,
    amenities: "No",
    vacated: false,
    optin: false,
  });
  const [paid, setPaid] = useState(false);
  const fromDates = [
    "14th March Morning",
    "15th March Morning",
    "16th March Morning",
  ];
  const toDates = [
    "14th March Night",
    "15th March Night",
    "16th March Evening",
  ];
  const roomCost = {
    "Accommodation Optin*": "0",
    "Common Free Hall": 0,
    Room: 125,
    "Two Sharing": 125,
    "Twin Sharing with common bathroom": 250,
  };

  const [accomodationDetails, setAccomodationDetails] = useState(false);
  const [maleCurrent, setMaleCurrent] = useState(0);
  const [femaleCurrent, setFemaleCurrent] = useState(0);
  const [mail, setMail] = useState("");
  const maleMax = 45;
  const femaleMax = 16;
  const router = useRouter();

  useEffect(() => {
    const mailLocal = localStorage.getItem("email");
    setMail(mailLocal);
    fetchPaymentDetailsByEmail(localStorage.getItem("email")).then((res) => {
      for (let i = 0; i < res.data.data.length; i++) {
        if (res.data.data[i].status === "SUCCESS") {
          setPaid(true);
        }
      }
    });
  }, []);

  useEffect(() => {
    fetchUserByEmail(localStorage.getItem("email")).then((res) => {
      setFormData({
        ...formData,
        name: res?.data.user.name,
        email: res?.data.user.email,
        kriyaId: res?.data.user.kriyaId,
        college: res?.data.user.college,
        phone: res?.data.user.phone,
      });
    });
  }, []);

  useEffect(() => {
    toast.promise(
      fetchAccomodationDetailsByEmail(localStorage.getItem("email")),
      {
        loading: "Loading...",
        success: (res) => {
          if (res.data.accommodations) {
            setAccomodationDetails(true);
          }
          return "Loaded Successfully";
        },
        error: (err) => {
          console.log(err);
        },
      }
    );
  }, []);

  useEffect(() => {
    fetchMasterAccommodation().then((res) => {
      setMaleCurrent(
        res.data?.maleStats?.find(
          (item) => item.roomType === "Common Free Hall"
        )?.count
      );
      setFemaleCurrent(
        res.data?.femaleStats?.find(
          (item) => item.roomType === "Common Free Hall"
        )?.count
      );
    });
  }, []);

  const handleProceed = async () => {
    const newFormData = {
      ...formData,
      days:
        formData.from === "14th March Morning"
          ? toDates.indexOf(formData.to) - fromDates.indexOf(formData.from) + 1
          : toDates.indexOf(formData.to) - fromDates.indexOf(formData.from) + 1,
      amount:
        (formData.from === "14th March Morning"
          ? toDates.indexOf(formData.to) - fromDates.indexOf(formData.from) + 1
          : toDates.indexOf(formData.to) -
          fromDates.indexOf(formData.from) +
          1) *
        roomCost[formData.roomType] +
        50 *
        (formData.breakfast1 +
          formData.breakfast2 +
          formData.breakfast3 +
          formData.dinner1 +
          formData.dinner2),
    };

    toast.promise(fetchAccomodationRegister(newFormData), {
      loading: "Registering...",
      success: (res) => {
        router.push("/portal/acc-registered");
        return "Registered Successfully";
      },
      error: (err) => {
        return "Error Occured";
      },
    });
  };
  return (
    <>
      {!accomodationDetails || acc ? (
        <div className="flex flex-col">
          <div className="flex flex-col gap-6 mt-8 lg:flex-row">
            <section className="w-full space-y-4 lg:w-1/2">
              <p className="font-semibold">Dear participant, </p>
              <p className="">
                Rooms are available from the Morning of{" "}
                <b className="font-semibold"> 14th March 2025</b> to the Evening
                of
                <b className="font-semibold"> 16th March 2025 </b>. (No
                accommodation will be provided on the 16 th March
                night.Participants can check in from{" "}
                <b className="font-semibold">10 PM</b> on{" "}
                <b className="font-semibold">13th March 2025</b>. )
              </p>
              {!mail && (
                <React.Fragment>
                  <p className="">
                    Kindly login to proceed with the application for the same.
                  </p>
                  <div className="flex flex-row w-full space-x-6">
                    <button
                      className="lg:text-lg font-semibold w-full text-center flex justify-center font-poppins text-white bg-[#3b82f6] border-2 border-[#3b82f6] shadow-lg hover:bg-[#83144d] transition-all px-6 py-2 rounded-lg my-8 lg:mb-16 whitespace-nowrap lg:whitespace-normal relative z-40"
                      onClick={() => {
                        router.push("/auth?type=signup");
                      }}
                    >
                      Register
                    </button>
                    <button
                      className="lg:text-lg font-semibold w-full text-center flex justify-center font-poppins bg-white text-[#3b82f6] border-2 border-[#3b82f6] shadow-lg hover:bg-gray-100 transition-all px-8 py-2 rounded-lg my-8 lg:mb-16 whitespace-nowrap lg:whitespace-normal"
                      onClick={() => {
                        router.push("/auth?type=login");
                      }}
                    >
                      Login
                    </button>
                  </div>
                </React.Fragment>
              )}
               {mail && (
                <div>
                  <p className="">
                    <b className="font-semibold">Note: </b>Accommodation will be
                    provided to participants who have either{" "}
                    <b className="font-semibold">
                      paid the general registration fee
                    </b>{" "}
                    (or) registered for{" "}
                    <b className="font-semibold">atleast one workshop</b>.
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      className="flex items-center px-4 py-3 text-white bg-blue-500 w-fit rounded-xl font-poppins group"
                      onClick={() => router.push("/auth/payment?type=GENERAL")}
                      type="button"
                    >
                      <p className="">Pay general registration fee!</p>
                      <IoIosArrowForward
                        className="ml-2 transition-all group-hover:translate-x-2"
                        size={24}
                      />
                    </button>
                  </div>

                  <form
                    className="mt-6 grid grid-cols-1 gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleProceed();
                    }}
                  >
                    <Inputfield
                      label="Residential Address"
                      value={formData.residentialAddress}
                      onChange={(e) =>
                        setFormData({ ...formData, residentialAddress: e.target.value })
                      }
                    />

                    <div className="flex gap-4">
                      <Inputfield
                        label="City"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                      <Inputfield
                        label="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label className="block text-sm text-gray-600 mb-1">Gender</label>
                        <select
                          className="w-full border-2 rounded-md p-2"
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div className="w-1/2">
                        <label className="block text-sm text-gray-600 mb-1">Room Type</label>
                        <select
                          className="w-full border-2 rounded-md p-2"
                          value={formData.roomType}
                          onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                        >
                          <option value="">Select room type</option>
                          {Object.keys(roomCost).map((rt) => (
                            <option key={rt} value={rt}>
                              {rt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label className="block text-sm text-gray-600 mb-1">From</label>
                        <select
                          className="w-full border-2 rounded-md p-2"
                          value={formData.from}
                          onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                        >
                          {fromDates.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm text-gray-600 mb-1">To</label>
                        <select
                          className="w-full border-2 rounded-md p-2"
                          value={formData.to}
                          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                        >
                          {toDates.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-6 items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.breakfast1}
                          onChange={(e) => setFormData({ ...formData, breakfast1: e.target.checked })}
                        />
                        <span className="text-sm">Breakfast Day 1 (+₹50)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.breakfast2}
                          onChange={(e) => setFormData({ ...formData, breakfast2: e.target.checked })}
                        />
                        <span className="text-sm">Breakfast Day 2 (+₹50)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.breakfast3}
                          onChange={(e) => setFormData({ ...formData, breakfast3: e.target.checked })}
                        />
                        <span className="text-sm">Breakfast Day 3 (+₹50)</span>
                      </label>
                    </div>

                    <div className="flex gap-6 items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.dinner1}
                          onChange={(e) => setFormData({ ...formData, dinner1: e.target.checked })}
                        />
                        <span className="text-sm">Dinner Day 1 (+₹50)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.dinner2}
                          onChange={(e) => setFormData({ ...formData, dinner2: e.target.checked })}
                        />
                        <span className="text-sm">Dinner Day 2 (+₹50)</span>
                      </label>
                    </div>

                    <div className="flex gap-4 items-center">
                      <label className="block text-sm text-gray-600">Amenities</label>
                      <select
                        className="border-2 rounded-md p-2"
                        value={formData.amenities}
                        onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                      >
                        <option>No</option>
                        <option>Yes</option>
                      </select>

                      <label className="flex items-center gap-2 ml-6">
                        <input
                          type="checkbox"
                          checked={formData.optin}
                          onChange={(e) => setFormData({ ...formData, optin: e.target.checked })}
                        />
                        <span className="text-sm">Opt-in for updates</span>
                      </label>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-3 text-white bg-[#3b82f6] rounded-lg"
                      >
                        Register for Accommodation
                      </button>
                      <button
                        type="button"
                        className="flex-1 px-4 py-3 border rounded-lg"
                        onClick={() => router.push("/portal/acc-registered")}
                      >
                        View applied details
                      </button>
                    </div>
                  </form>
                </div>
              )} 
            </section>
            <section className="flex flex-row justify-center w-full lg:w-1/2 lg:justify-end">
              <img
                src="/assets/Design/acc.jpg"
                alt="accomodation"
                className="w-auto lg:h-64 lg:-mt-20"
              />
            </section>
          </div>
          <div className="flex flex-col gap-6 mt-8 lg:flex-row">
            No On-Spot accommodations are available.
          </div>
        </div>
      ) : (
        <div className="mt-12">
          <h1 className="text-2xl font-semibold">
            You have already applied for accomodation.
          </h1>
          <button
            onClick={() => {
              router.push("/portal/acc-registered");
            }}
            className="flex items-center gap-2 mt-8 bg-[#3b82f6] text-white px-4 py-2 rounded-lg font-semibold"
          >
            View your details here
            <IoIosArrowForward />
          </button>
        </div>
      )}
      <Toaster />
    </>
  );
}

export default Details;
