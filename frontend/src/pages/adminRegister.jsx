import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import AdminContent from '../components/adminContent';
import Register from '../components/Register';
import AdminDownloadPage from '../components/AdminDownloadPage';
import AdminUploadPage from '../components/AdminUploadPage';

const AdminRegister = () => {
    const navigate = useNavigate();
    const [check, setCheck] = useState(0);
    const handleRegister = () => {
        navigate("/admin/login");
    };

    const handleContent = (val) => {
        setCheck(val);
    };

    const handleDownload = () => {
        setCheck(2);
    };

    const handleUpload = () => {
        setCheck(3);
    };

    return (
        <>
            {check === 0 ? <Register handleRegister={handleRegister} /> : null}
            {check === 1 ? <AdminContent handleContent={handleContent} /> : null}
            {check === 2 ? <AdminDownloadPage handleDownload={handleDownload} /> : null}
            {check === 3 ? <AdminUploadPage handleUpload={handleUpload} /> : null}
        </>
    );
}

export default AdminRegister;
