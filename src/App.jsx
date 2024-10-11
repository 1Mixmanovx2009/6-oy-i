import React, { useState, useEffect, useContext, createContext } from 'react';
import mpty from "./assets/no-image-icon-6.png";

const LikedUsersContext = createContext();

const LikedUsersProvider = ({ children }) => {
  const [likedUsers, setLikedUsers] = useState(() => {
    const storedLikedUsers = localStorage.getItem('likedUsers');
    return storedLikedUsers ? JSON.parse(storedLikedUsers) : [];
  });

  const addLikedUser = (user) => {
    const updatedLikedUsers = [...likedUsers, user];
    setLikedUsers(updatedLikedUsers);
    localStorage.setItem('likedUsers', JSON.stringify(updatedLikedUsers));
  };

  const removeLikedUser = (email) => {
    const updatedLikedUsers = likedUsers.filter(user => user.email !== email);
    setLikedUsers(updatedLikedUsers);
    localStorage.setItem('likedUsers', JSON.stringify(updatedLikedUsers));
  };

  return (
    <LikedUsersContext.Provider value={{ likedUsers, addLikedUser, removeLikedUser }}>
      {children}
    </LikedUsersContext.Provider>
  );
};

const UserCard = ({ user, deleteUser }) => {
  const { addLikedUser, removeLikedUser } = useContext(LikedUsersContext);
  const [isLiked, setIsLiked] = useState(() => {
    const storedLikedUsers = localStorage.getItem('likedUsers');
    return storedLikedUsers ? JSON.parse(storedLikedUsers).some(u => u.email === user.email) : false;
  });

  const handleLike = () => {
    if (!isLiked) {
      addLikedUser(user);
    } else {
      removeLikedUser(user.email);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className=" bg-white shadow-md rounded-lg p-4 m-4 max-w-xs">
      <img className="w-32 h-32 rounded-full mx-auto" src={user.image} alt={user.name} />
      <h2 className="text-xl font-semibold mt-2 text-center">{user.name} {user.surname}</h2>
      <p className="text-gray-500 text-center">Email: {user.email}</p>
      <p className="text-gray-500 text-center">Age: {user.age}</p>
      <p className="text-gray-500 text-center">Job: {user.job}</p>
      <div className="flex justify-between mt-4">
        <button
          onClick={handleLike}
          className={`px-4 py-2 rounded-lg ${isLiked ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'} transition duration-200`}
        >
          {isLiked ? 'Unlike' : 'Like'}
        </button>
        <button
          onClick={() => deleteUser(user.email)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg transition duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const AddUser = ({ addUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    age: '',
    job: '',
    image: mpty,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser(formData);
    setFormData({
      name: '',
      surname: '',
      email: '',
      age: '',
      job: '',
      image: mpty,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 m-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New User</h2>
      <div>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-4">
        <label>Surname</label>
        <input
          type="text"
          name="surname"
          value={formData.surname}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-4">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-4">
        <label>Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-4">
        <label>Job</label>
        <input
          type="text"
          name="job"
          value={formData.job}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-4">
        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <img src={formData.image} alt="Preview" className="w-32 h-32 mt-4" />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-200"
      >
        Add User
      </button>
    </form>
  );
};

const App = () => {
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [
      {
        name: 'Xojiakbar',
        surname: 'M',
        email: 'Xojiakbar422@gmail.com',
        age: 15,
        job: 'oqivchi',
        image: mpty,
      },
    ];
  });

  const addUser = (user) => {
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const deleteUser = (email) => {
    const updatedUsers = users.filter(user => user.email !== email);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <LikedUsersProvider>
      <div>
        <h1>User Cards</h1>
        <AddUser addUser={addUser} />
        <div>
          {users.map(user => (
            <UserCard key={user.email} user={user} deleteUser={deleteUser} />
          ))}
        </div>
        <LikedUsers />
      </div>
    </LikedUsersProvider>
  );
};

const LikedUsers = () => {
  const { likedUsers } = useContext(LikedUsersContext);

  return (
    <div>
      <h2>Liked Users</h2>
      {likedUsers.map(user => (
        <div key={user.email} className="flex items-center">
          <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full mr-2" />
          <p>{user.name} {user.surname}</p>
        </div>
      ))}
    </div>
  );
};

export default App
