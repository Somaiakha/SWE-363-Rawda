import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  X
} from "lucide-react";

export default function Services() {
  const [services, setServices] =
    useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState(null);

  const [mode, setMode] =
    useState("add");

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      pricePerDay: "",
      startDate: "",
      endDate: ""
    });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res =
        await axios.get(
          "http://localhost:5050/api/services"
        );

      setServices(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      pricePerDay: "",
      startDate: "",
      endDate: ""
    });

    setSelectedId(null);
  };

  const openAdd = () => {
    resetForm();
    setMode("add");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setMode("edit");
    setSelectedId(item._id);

    setFormData({
      title: item.title,
      description:
        item.description,
      pricePerDay:
        item.pricePerDay,
      startDate:
        item.startDate,
      endDate:
        item.endDate
    });

    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (mode === "add") {
        await axios.post(
          "http://localhost:5050/api/services",
          formData
        );
      } else {
        await axios.put(
          `http://localhost:5050/api/services/${selectedId}`,
          formData
        );
      }

      fetchServices();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteService =
    async (id) => {
      try {
        await axios.delete(
          `http://localhost:5050/api/services/${id}`
        );

        fetchServices();
      } catch (err) {
        console.log(err);
      }
    };

  return (
    <div className="max-w-7xl mx-auto">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Services
          </h1>

          <p className="text-gray-500">
            Manage plant care offerings
          </p>
        </div>

        <button
          onClick={openAdd}
          className="bg-orange-600 text-white px-5 py-3 rounded-xl flex gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {services.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl p-6 shadow border"
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">
                {item.title}
              </h2>

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                {item.status}
              </span>
            </div>

            <p className="text-gray-600 mb-5">
              {item.description}
            </p>

            <div className="flex gap-2 items-center text-sm text-gray-500 mb-5">
              <Calendar className="w-4 h-4" />
              {item.startDate} - {item.endDate}
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-orange-600">
                  $
                  {item.pricePerDay}
                </p>

                <p className="text-xs text-gray-500">
                  per day
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    openEdit(item)
                  }
                >
                  <Edit className="w-5 h-5 text-blue-600" />
                </button>

                <button
                  onClick={() =>
                    deleteService(
                      item._id
                    )
                  }
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white w-[520px] rounded-2xl p-6">

            <div className="flex justify-between mb-5">
              <h2 className="text-2xl font-bold">
                {mode === "add"
                  ? "Add New Service"
                  : "Edit Service"}
              </h2>

              <button
                onClick={() =>
                  setShowModal(
                    false
                  )
                }
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">

              <input
                placeholder="Title"
                value={
                  formData.title
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title:
                      e.target.value
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
              />

              <textarea
                rows="3"
                placeholder="Description"
                value={
                  formData.description
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description:
                      e.target.value
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                placeholder="Price Per Day"
                value={
                  formData.pricePerDay
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricePerDay:
                      e.target.value
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
              />

              <div className="grid grid-cols-2 gap-3">

                <input
                  type="date"
                  value={
                    formData.startDate
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      startDate:
                        e.target.value
                    })
                  }
                  className="border rounded-xl px-4 py-3"
                />

                <input
                  type="date"
                  value={
                    formData.endDate
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endDate:
                        e.target.value
                    })
                  }
                  className="border rounded-xl px-4 py-3"
                />

              </div>
            </div>

            <div className="flex gap-3 mt-6">

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="w-full border rounded-xl py-3"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="w-full bg-orange-600 text-white rounded-xl py-3"
              >
                {mode === "add"
                  ? "Publish Service"
                  : "Update Service"}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}