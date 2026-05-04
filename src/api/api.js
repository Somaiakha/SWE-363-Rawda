// src/api/api.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050/api";

function getToken() {
    return localStorage.getItem("token");
}

async function request(endpoint, options = {}) {
    const token = getToken();
    const config = {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
        ...options,
    };
    const res  = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
    login:    (email, password) =>
        request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    register: (name, email, password, role) =>
        request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password, role }) }),
    me: () => request("/auth/me"),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersAPI = {
    getById: (id)        => request(`/users/${id}`),
    update:  (id, data)  => request(`/users/${id}`, { method: "PUT",    body: JSON.stringify(data) }),
    delete:  (id)        => request(`/users/${id}`, { method: "DELETE" }),
    getAll:  ()          => request("/users"),
};

// ─── Questions ────────────────────────────────────────────────────────────────
export const questionsAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/questions${query ? `?${query}` : ""}`);
    },
    getById:  (id)   => request(`/questions/${id}`),
    create:   (data) => request("/questions", { method: "POST", body: JSON.stringify(data) }),
    like:     (id)   => request(`/questions/${id}/like`,     { method: "POST" }),
    bookmark: (id)   => request(`/questions/${id}/bookmark`, { method: "POST" }),
};

// ─── Answers ──────────────────────────────────────────────────────────────────
export const answersAPI = {
    create: (questionId, content) =>
        request(`/questions/${questionId}/answers`, { method: "POST", body: JSON.stringify({ content }) }),
    like: (questionId, answerId) =>
        request(`/questions/${questionId}/answers/${answerId}/like`, { method: "POST" }),
};

// ─── Guides ───────────────────────────────────────────────────────────────────
export const guidesAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/guides${query ? `?${query}` : ""}`);
    },
    getById: (id)   => request(`/guides/${id}`),
    create:  (data) => request("/guides", { method: "POST", body: JSON.stringify(data) }),
    save:    (id)   => request(`/guides/${id}/save`, { method: "POST" }),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingsAPI = {
    create:       (data)        => request("/bookings", { method: "POST", body: JSON.stringify(data) }),
    getMine:      ()            => request("/bookings/me"),
    getAll:       ()            => request("/bookings"),
    updateStatus: (id, status)  => request(`/bookings/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
};

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviewsAPI = {
    create:     (data)    => request("/reviews",             { method: "POST", body: JSON.stringify(data) }),
    getByStore: (storeId) => request(`/reviews/store/${storeId}`),
    getMine:    ()        => request("/reviews/me"),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productsAPI = {
    getAll:  ()         => request("/products"),
    create:  (data)     => request("/products",      { method: "POST",   body: JSON.stringify(data) }),
    update:  (id, data) => request(`/products/${id}`,{ method: "PUT",    body: JSON.stringify(data) }),
    delete:  (id)       => request(`/products/${id}`,{ method: "DELETE" }),
};