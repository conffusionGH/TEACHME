// const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     const combinedDeadline = `${formData.deadlineDate}T${formData.deadlineTime}`;
  
//     const payload = new FormData();
//     payload.append('title', formData.title);
//     payload.append('description', formData.description);
//     payload.append('deadline', combinedDeadline);
//     payload.append('subjectId', formData.subjectId);
//     if (formData.pdf) payload.append('pdf', formData.pdf);
  
//     try {
//       setLoading(true);
  
//       const response = await axios({
//         url: assignmentAPI.url,
//         method: assignmentAPI.method,
//         data: payload,
//         headers: { 'Content-Type': 'multipart/form-data' },
//         withCredentials: true
//       });
  
//       toast.success('Assignment created successfully!');
//       setFormData({
//         title: '',
//         description: '',
//         deadlineDate: '',
//         deadlineTime: '',
//         subjectId: '',
//         pdf: null
//       });
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

  
//   <div className="md:col-span-1">
//   <label htmlFor="deadlineDate" className="block text-sm font-medium text-gray-700 mb-1">Deadline Date</label>
//   <input
//     type="date"
//     id="deadlineDate"
//     min={new Date().toISOString().split('T')[0]}
//     className="w-full border border-gray-300 rounded-lg px-3 py-2"
//     value={formData.deadlineDate}
//     onChange={handleChange}
//     required
//   />
// </div>

// <div className="md:col-span-1">
//   <label htmlFor="deadlineTime" className="block text-sm font-medium text-gray-700 mb-1">Deadline Time</label>
//   <input
//     type="time"
//     id="deadlineTime"
//     className="w-full border border-gray-300 rounded-lg px-3 py-2"
//     value={formData.deadlineTime}
//     onChange={handleChange}
//     required
//   />
// </div>

// <div className="md:col-span-2">
//   <label htmlFor="pdf" className="block text-sm font-medium text-gray-700 mb-1">Upload PDF</label>
//   <input
//     type="file"
//     id="pdf"
//     accept="application/pdf"
//     className="w-full"
//     onChange={handleFileChange}
//   />
// </div>


// const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     deadlineDate: '',
//     deadlineTime: '',
//     subjectId: '',
//     pdf: null,
//   });
//   const handleFileChange = (e) => {
//     setFormData({
//       ...formData,
//       pdf: e.target.files[0],
//     });
//   };
    