import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUser } from "../context/usercontext";

export function CreateEventDialog({ open, onOpenChange, onSubmit }) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("technology");
  const [image, setImage] = useState(null);
  const [urgency, setUrgency] = useState("medium");
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const { token } = useUser();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
   try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("category", category);
    formData.append("urgency", urgency);
    formData.append("time", time);
    if (image) {
      formData.append("image", image);
      console.log(formData.get("image"));
    }
    
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URI}/api/events/addevent`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      }
    );
    toast.success("event added successfully!");
    console.log(response);
    onSubmit(response.data);
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to add event!");
  }
    // onSubmit(formData);
    
    // Reset form
    setName("");
    setDescription("");
    setDate("");
    setCategory("");
    setImage(null);
    setPreviewUrl(null);
    setUrgency("medium");
  };

  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
          <div className="relative p-6 border-b border-gray-200">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-600"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-center text-gray-800">Add New Event</h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Event Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter event name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                    <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="technology">Technology</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                    </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                    <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                      Urgency
                    </label>
                    <select
                      id="urgency"
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                      Event Image
                    </label>
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start"> */}
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-600 file:text-white hover:file:bg-gray-700"
                      />
                      
                    {/* </div> */}
                  
              </div>
                
              </div>
            
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Enter event description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] resize-y"
                />
              </div>
              
              

               
              <div className="flex justify-end space-x-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}