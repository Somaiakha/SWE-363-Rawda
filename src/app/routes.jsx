// src/app/routes.jsx
import { createBrowserRouter, Navigate } from "react-router";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import QuestionDetail from "./pages/QuestionDetail";
import CreateGuide from "./pages/CreateGuide";
import AnswerQuestions from "./pages/AnswerQuestions";
import ReviewAnswers from "./pages/ReviewAnswers";
import SubmitPlantInfo from "./pages/SubmitPlantInfo";
import Badges from "./pages/Badges";
import Settings from "./pages/Settings";

// Home Gardener
import GardenerLayout from "./layouts/GardenerLayout";
import GardenerHome from "./pages/gardener/GardenerHome";
import PlantCareChatbot from "./pages/gardener/PlantCareChatbot";
import QAForum from "./pages/gardener/QAForum";
import ForumQuestionDetail from "./pages/gardener/ForumQuestionDetail";
import PlantGuides from "./pages/gardener/PlantGuides";
import GuideDetail from "./pages/gardener/GuideDetail";
import PlantCareServices from "./pages/gardener/PlantCareServices";
import RatePlantStores from "./pages/gardener/RatePlantStores";
import GardenerProfile from "./pages/gardener/GardenerProfile";
import DeleteAccount from "./pages/gardener/DeleteAccount";
import AccountDeleted from "./pages/gardener/AccountDeleted";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ExpertApplications from "./pages/admin/ExpertApplications";
import ForumModeration from "./pages/admin/ForumModeration";
import StoreReviews from "./pages/admin/StoreReviews";
import ContentApproval from "./pages/admin/ContentApproval";
import Subscriptions from "./pages/admin/Subscriptions";
import BadgesSystem from "./pages/admin/BadgesSystem";

// Store
import StoreAuth from "./pages/store/StoreAuth";
import StoreLayout from "./layouts/StoreLayout";
import StoreDashboard from "./pages/store/StoreDashboard";
import StoreProfile from "./pages/store/StoreProfile";
import Products from "./pages/store/Products";
import Services from "./pages/store/Services";
import ServiceRequests from "./pages/store/ServiceRequests";
import StoreRatings from "./pages/store/StoreRatings";

// Login Pages
import ExpertLogin from "./pages/ExpertLogin";
import GardenerLogin from "./pages/GardenerLogin";
import RoleSelector from "./pages/RoleSelector";

export const router = createBrowserRouter([
  { path: "/", Component: RoleSelector },

  { path: "/expert/login", Component: ExpertLogin },
  {
    path: "/expert",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardHome },
      { path: "question/:id", Component: QuestionDetail },
      { path: "create-guide", Component: CreateGuide },
      { path: "answer", Component: AnswerQuestions },
      { path: "review", Component: ReviewAnswers },
      { path: "submit", Component: SubmitPlantInfo },
      { path: "badges", Component: Badges },
      { path: "settings", Component: Settings },
    ],
  },

  { path: "/gardener/login", Component: GardenerLogin },
  { path: "/gardener/account-deleted", Component: AccountDeleted },
  {
    path: "/gardener",
    Component: GardenerLayout,
    children: [
      { index: true, Component: GardenerHome },
      { path: "chatbot", Component: PlantCareChatbot },
      { path: "forum", Component: QAForum },
      { path: "forum/:id", Component: ForumQuestionDetail },
      { path: "guides", Component: PlantGuides },
      { path: "guides/:id", Component: GuideDetail },        // ← NEW
      { path: "services", Component: PlantCareServices },
      { path: "ratings", Component: RatePlantStores },
      { path: "profile", Component: GardenerProfile },
      { path: "delete-account", Component: DeleteAccount },
    ],
  },

  { path: "/store/login", Component: StoreAuth },
  {
    path: "/store",
    Component: StoreLayout,
    children: [
      { index: true, Component: StoreDashboard },
      { path: "profile", Component: StoreProfile },
      { path: "products", Component: Products },
      { path: "services", Component: Services },
      { path: "requests", Component: ServiceRequests },
      { path: "ratings", Component: StoreRatings },
    ],
  },

  { path: "/admin/login", Component: AdminLogin },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", Component: AdminDashboard },
      { path: "users", Component: ManageUsers },
      { path: "experts", Component: ExpertApplications },
      { path: "forum", Component: ForumModeration },
      { path: "reviews", Component: StoreReviews },
      { path: "content", Component: ContentApproval },
      { path: "subscriptions", Component: Subscriptions },
      { path: "badges", Component: BadgesSystem },
    ],
  },

  { path: "*", Component: () => <Navigate to="/" replace /> },
]);