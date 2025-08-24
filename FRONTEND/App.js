import React, { useMemo, useState } from "react";
import "./App.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { QRCodeCanvas } from "qrcode.react";

function App() {
  /** -----------------------------
   * Teacher Section State
   * ----------------------------- */
  const [teacherAddress, setTeacherAddress] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectMarks, setSubjectMarks] = useState("");

  const [teacherSubmissions, setTeacherSubmissions] = useState([]);

  const connectWallet = (e) => {
    e.preventDefault();
    if (!teacherAddress.trim()) {
      alert("Please enter your address before connecting your wallet.");
      return;
    }
    setWalletConnected(true);
  };

  const handleTeacherSubmit = (e) => {
    e.preventDefault();
    if (!walletConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!studentName.trim() || !subjectName.trim() || subjectMarks === "") {
      alert("Please fill all fields.");
      return;
    }

    const entry = {
      teacherAddress,
      studentName,
      subjectName,
      subjectMarks: Number(subjectMarks),
      timestamp: new Date().toISOString(),
    };
    setTeacherSubmissions((prev) => [entry, ...prev]);

    setStudentName("");
    setSubjectName("");
    setSubjectMarks("");
  };

  /** -----------------------------
   * Student Section State
   * ----------------------------- */
  const [studentAddress, setStudentAddress] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleStudentLogin = (e) => {
    e.preventDefault();
    if (!studentAddress.trim()) {
      alert("Please enter a valid student address.");
      return;
    }
    alert("✅ Student Address Found!");
    setIsLoggedIn(true);
  };

  /** -----------------------------
   * Static Marks Data (Year-wise)
   * ----------------------------- */
  const marksData = {
    "1st Year": [
      { subject: "Maths", marks: 98 },
      { subject: "Science", marks: 79 },
      { subject: "C", marks: 80 },
      { subject: "Graphics Engineering", marks: 80 },
      { subject: "Management", marks: 90 },
    ],
    "2nd Year": [
      { subject: "Computer Graphics", marks: 60 },
      { subject: "Data Structures", marks: 80 },
      { subject: "C++", marks: 90 },
      { subject: "UHV", marks: 92 },
      { subject: "Probability", marks: 78 },
    ],
    "3rd Year": [
      { subject: "AI", marks: 92 },
      { subject: "FLAT", marks: 97 },
      { subject: "ML", marks: 89 },
      { subject: "DBMS", marks: 69 },
      { subject: "MDM", marks: 58 },
    ],
    "4th Year": [
      { subject: "Python", marks: 78 },
      { subject: "Java", marks: 67 },
      { subject: "Security", marks: 78 },
      { subject: "Blockchain", marks: 90 },
    ],
  };

  const chartData = useMemo(
    () =>
      Object.entries(marksData).flatMap(([year, subjects]) =>
        subjects.map((s) => ({ year, subject: s.subject, marks: s.marks }))
      ),
    []
  );

  /** -----------------------------
   * QR Code Link
   * ----------------------------- */
  const dashboardURL = useMemo(() => {
    return `${window.location.origin}/#dashboard`;
  }, []);

  return (
    <div className="app">
      <h1 className="heading">Student Grading System</h1>

      <div className="container">
        {/* --------------- Teacher Section --------------- */}
        <section className="section teacher-section">
          <h2>Teacher Section</h2>

          <form className="teacher-form" onSubmit={handleTeacherSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Enter Your Address"
                value={teacherAddress}
                onChange={(e) => setTeacherAddress(e.target.value)}
              />
              <button className="secondary" onClick={connectWallet}>
                Connect Wallet
              </button>
            </div>

            {walletConnected && (
              <>
                <div className="connected-badge" role="status">
                  ✅ Connected to wallet{teacherAddress ? `: ${teacherAddress}` : ""}
                </div>

                <div className="grid-3">
                  <input
                    type="text"
                    placeholder="Enter Student Name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Enter Subject Name"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Enter Marks"
                    value={subjectMarks}
                    onChange={(e) => setSubjectMarks(e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>

                <button type="submit">Submit</button>
              </>
            )}
          </form>

          {teacherSubmissions.length > 0 && (
            <div className="submissions">
              <h3>Recent Submissions (Local Demo)</h3>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Teacher Address</th>
                    <th>Student Name</th>
                    <th>Subject</th>
                    <th>Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherSubmissions.map((s, idx) => (
                    <tr key={`${s.timestamp}-${idx}`}>
                      <td>{new Date(s.timestamp).toLocaleString()}</td>
                      <td className="mono">{s.teacherAddress}</td>
                      <td>{s.studentName}</td>
                      <td>{s.subjectName}</td>
                      <td>{s.subjectMarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* --------------- Student Section --------------- */}
        <section className="section student-section">
          <h2>Student Section</h2>

          {!isLoggedIn ? (
            <form className="login-form" onSubmit={handleStudentLogin}>
              <input
                type="text"
                placeholder="Enter Student Address"
                value={studentAddress}
                onChange={(e) => setStudentAddress(e.target.value)}
                required
              />
              <button type="submit">Submit</button>
            </form>
          ) : (
            <div className="dashboard">
              <h3>Welcome, {studentAddress}</h3>
              <h4>Your Marks by Year</h4>

              {Object.entries(marksData).map(([year, subjects]) => (
                <div key={year} className="year-section">
                  <h4>{year}</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((item, i) => (
                        <tr key={`${year}-${item.subject}-${i}`}>
                          <td>{item.subject}</td>
                          <td>{item.marks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}

              <h3>Graphical Dashboard</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={360}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="subject"
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="marks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <h3>Scan to View on Your Phone</h3>
              <div className="qr-code">
                <QRCodeCanvas value={dashboardURL} size={180} includeMargin />
                <div className="qr-caption">{dashboardURL}</div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
