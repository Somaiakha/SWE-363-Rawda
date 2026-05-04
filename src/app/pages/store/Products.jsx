import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X
} from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [modalMode, setModalMode] = useState("add");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: ""
    });
  };

  const handleAdd = () => {
    resetForm();
    setModalMode("add");
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalMode("edit");

    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description
    });

    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (modalMode === "add") {
        await axios.post("http://localhost:5050/api/products", formData);
        showToast("Product Added");
      } else {
        await axios.put(
          `http://localhost:5050/api/products/${selectedProduct._id}`,
          formData
        );
        showToast("Product Updated");
      }

      fetchProducts();
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5050/api/products/${productToDelete._id}`
      );

      fetchProducts();
      setShowDeleteModal(false);
      showToast("Deleted Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const getStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return "Low Stock";
    return "In Stock";
  };

  const getStatusStyle = (status) => {
    if (status === "In Stock")
      return "bg-green-100 text-green-700";

    if (status === "Low Stock")
      return "bg-yellow-100 text-yellow-700";

    return "bg-red-100 text-red-700";
  };

  const filteredProducts = products.filter((item) => {
    const searchMatch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const categoryMatch =
      filterCategory === "all" ||
      item.category === filterCategory;

    return searchMatch && categoryMatch;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="p-8 bg-[#f8f8f8] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Products
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your inventory
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow mb-8 grid md:grid-cols-2 gap-4">
        <div className="relative">
          <Search
            className="absolute left-4 top-3.5 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-full border rounded-xl py-3 pl-11 pr-4"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
          />
        </div>

        <div className="relative">
          <Filter
            className="absolute left-4 top-3.5 text-gray-400"
            size={18}
          />

          <select
            className="w-full border rounded-xl py-3 pl-11 pr-4"
            value={filterCategory}
            onChange={(e) =>
              setFilterCategory(e.target.value)
            }
          >
            <option value="all">All Categories</option>

            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-5">Name</th>
              <th className="p-5">Category</th>
              <th className="p-5">Price</th>
              <th className="p-5">Stock</th>
              <th className="p-5">Status</th>
              <th className="p-5">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((item) => {
              const status = getStatus(item.stock);

              return (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-5 font-medium">
                    {item.name}
                  </td>

                  <td className="p-5 text-gray-600">
                    {item.category}
                  </td>

                  <td className="p-5 font-medium">
                    ${item.price}
                  </td>

                  <td className="p-5">
                    {item.stock}
                  </td>

                  <td className="p-5">
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </td>

                  <td className="p-5">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => {
                          setProductToDelete(item);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">
                {modalMode === "add"
                  ? "Add Product"
                  : "Edit Product"}
              </h2>

              <button
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <input
                className="w-full border rounded-xl p-3"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value
                  })
                }
              />

              <input
                className="w-full border rounded-xl p-3"
                placeholder="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value
                  })
                }
              />

              <input
                className="w-full border rounded-xl p-3"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value
                  })
                }
              />

              <input
                className="w-full border rounded-xl p-3"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: e.target.value
                  })
                }
              />

              <textarea
                rows="3"
                className="w-full border rounded-xl p-3"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value
                  })
                }
              />
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
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px]">
            <h2 className="text-xl font-bold mb-4">
              Delete Product
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {productToDelete?.name}
              </span>
              ?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="w-full border py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="w-full bg-red-600 text-white rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}