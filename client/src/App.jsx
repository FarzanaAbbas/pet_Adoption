import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

const App = () => {

  const navStyle = {
    padding: "10px",
    backgroundColor: "#f4f4f4",
    borderBottom: "2px solid #ccc",
    display: "flex",
    justifyContent: "center",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#333",
    margin: "0 10px",
  };

  return (
    <Router>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>
          Home
        </Link>
        |
        <Link to="/add-pet" style={linkStyle}>
          Add Pet
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/add-pet" element={<AddPet />}
        />
        <Route path="/pets/:id" element={<PetDetails />} />
        {/* <Route path="/applications/:id" element={<ApplicationDetails />} /> Add this line */}

      </Routes>
    </Router>

  );
};
const HomePage = () => {
  return (
    <div>
      <div
        style={{
          backgroundImage: `url(photo-1534361960057-19889db9621e.avif)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "90vh",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "3rem", textAlign: "center", margin: "20px 0" }}>
          Welcome to Pet Haven
        </h1>
        <p style={{ fontSize: "1.5rem", color: "lightgrey", textAlign: "center", marginBottom: "40px" }}>
          Find your furry companion or give a home to pets in need. Explore
          available pets below.
        </p>

      </div>
      <PetList />
    </div>
  );
};


const AddPet = () => {
  const [pet, setPet] = useState({
    name: "",
    breed: "",
    age: "",
    gender: "",
    location: "",
    photo: null,
  });

  const navigate = useNavigate();
  // setPet({ ...pet, [e.target.name]: e.target.value })
  // Spreads (...pet) the previous state to keep existing values.
  // Updates only the field that changed (e.target.name).
  // Uses computed property names ([e.target.name]).
  // User types "Buddy" in the name field
  // setPet({ ...pet, name: "Buddy" });
  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pet_photos");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dturagatk/image/upload",
        formData
      );

      setPet((prevPet) => ({
        ...prevPet,
        photo: response.data.secure_url,
      }));

    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please check your internet connection and Cloudinary settings.");
    }
  };
  //   Prevents Overwriting Other Fields
  // If you did:

  // setPet({ photo: response.data.secure_url });
  // It would overwrite all other fields, keeping only photo.

  // Using:

  // setPet((prevPet) => ({ ...prevPet, photo: response.data.secure_url }));
  // Only updates photo, keeping other fields unchanged.

  //       Example Workflow
  // User selects an image.
  // Image is uploaded to Cloudinary via axios.post().
  // Cloudinary returns a response, including secure_url.
  // State is updated with secure_url.
  // The image is displayed in the UI.


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pet.photo) {
      alert("Please wait until the image is uploaded.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/pets", pet);
      alert("Pet added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error adding pet:", error);
      alert(
        'failed to add'
      )
    }
  };

  const formStyle = {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Add a New Pet</h1>
      <label>Name</label>
      <input
        type="text"
        name="name"
        value={pet.name}
        onChange={handleChange}
        placeholder="Enter name"
        required
        style={inputStyle}
      />
      <label>Breed</label>
      <input
        type="text"
        name="breed"
        value={pet.breed}
        onChange={handleChange}
        placeholder="Enter breed"
        required
        style={inputStyle}
      />
      <label>Age</label>
      <input
        type="text"
        name="age"
        value={pet.age}
        onChange={handleChange}
        placeholder="Enter age"
        required
        style={inputStyle}
      />
      <label>Gender</label>
      <input
        type="text"
        name="gender"
        value={pet.gender}
        onChange={handleChange}
        placeholder="Enter gender"
        required
        style={inputStyle}
      />
      <label>Location</label>
      <input
        type="text"
        name="location"
        value={pet.location}
        onChange={handleChange}
        placeholder="Enter location"
        required
        style={inputStyle}
      />
      <label>Photo</label>
      <input
        type="file"
        name="photo"
        onChange={handleFileChange}
        required
        style={inputStyle}
      />
      <button
        type="submit"
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add Pet
      </button>
    </form>
  );
};

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/pets")
      .then((response) => setPets(response.data))
      .catch((error) => console.error("Error fetching pets:", error));
  }, []);

  const handleAdopt = (petId) => {
    navigate(`/pets/${petId}`);
  };

  const filteredPets = pets.filter((pet) =>
    pet.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  //   "new york".includes("new") // true
  // "los angeles".includes("new") // false
  // "chicago".includes("new") // false
  // .filter() is used when we need to extract specific elements from an array based on a condition.
  // .filter() is used to extract elements that match a condition.

  // const filteredPets = pets.filter((pet) =>
  //   pet.location.toLowerCase().includes(locationFilter.toLowerCase())
  // );

  // It filters the pets array based on the location input.
  // Only pets whose location contains the user input (locationFilter) are included.
  // The result is stored in filteredPets, which is then used to display only the matching pets.


  const listStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  };

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    maxWidth: "300px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", color: "#333" }}>Available Pets</h1>
      <div style={{ maxWidth: "400px", margin: "20px auto" }}>
        <input
          type="text"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          placeholder="Filter by Location"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
      </div>
      <div style={listStyle}>
        {filteredPets.map((pet) => (
          <div key={pet._id} style={cardStyle}>
            <h3>{pet.name}</h3>
            <p>Breed: {pet.breed}</p>
            <p>Age: {pet.age}</p>
            <p>Gender: {pet.gender}</p>
            <p>Location: {pet.location}</p>
            <img
              src={pet.photo}
              alt={pet.name}
              style={{ width: "100%", borderRadius: "5px" }}
            />
            {pet.status === "Adopted" ? (
              <span style={{ color: "green" }}>Adopted</span>
            ) : (
              <button
                onClick={() => handleAdopt(pet._id)}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  marginTop: "10px",
                  cursor: "pointer",
                }}
              >
                Adopt
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const PetDetails = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [form, setForm] = useState({
    adopterName: "",
    email: "",
    phoneNumber: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/pets/${id}`)
      .then((response) => setPet(response.data))
      .catch((error) => console.error("Error fetching pet details:", error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/applications", {
        ...form,
        petId: id,
      })
      .then((response) => {
        alert("Application submitted successfully!");
        navigate('/');
      })
      .catch((error) => console.error("Error submitting application:", error));

  };

  if (!pet) return <div>Loading...</div>;

  const detailsStyle = {
    maxWidth: "500px",
    margin: "20px auto",
    textAlign: "center",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div style={detailsStyle}>
      <h1>Pet Adoption Application</h1>
      <img
        src={pet.photo}
        alt={pet.name}
        style={{ width: "100%", borderRadius: "8px", marginBottom: "20px" }}
      />
      <h2>{pet.name}</h2>
      <p>Breed: {pet.breed}</p>
      <p>Age: {pet.age} years</p>
      <p>Location: {pet.location}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          name="adopterName"
          value={form.adopterName}
          onChange={(e) => setForm({ ...form, adopterName: e.target.value })}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <input
          type="email"
          placeholder="Your Email"
          name="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <input
          type="text"
          placeholder="Your Phone"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

const ApplicationDetails = () => {
  const { id } = useParams(); // Get the application ID from the URL
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/applications/${id}`)
      .then((response) => {
        setApplication(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching application details");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#fff" }}>
      <h2>Adoption Application Details</h2>
      <p><strong>Adopter Name:</strong> {application.adopterName}</p>
      <p><strong>Email:</strong> {application.email}</p>
      <p><strong>Pet ID:</strong> {application.petId}</p>
    </div>
  );
};


export default App;
