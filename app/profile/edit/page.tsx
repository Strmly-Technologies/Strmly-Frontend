import EditForm from "../_components/EditForm";


export default function EditProfilePage() {
  const defaultValues = {
    username: "irshad", // hardcoded or fetched on server
    bio: "Full-stack developer",
    profile_photo: "", // optional
  };

  return <EditForm defaultValues={defaultValues} />;
}