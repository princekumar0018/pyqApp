import React, { useState } from 'react';
import NAV from '../components/navbar';
import { Button } from 'react-bootstrap';
import AdminContent from '../components/adminContent';
import Login from '../components/Login';
import AdminDownloadPage from '../components/AdminDownloadPage';
import AdminUploadPage from '../components/AdminUploadPage';

const AdminLogin = () => {
    const [check, setCheck] = useState(0);
    const handleLogin = () => {
        setCheck(1);
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
            {check === 0 ? <Login handleLogin={handleLogin} /> : null}
            {check === 1 ? <AdminContent handleContent={handleContent} /> : null}
            {check === 2 ? <AdminDownloadPage handleDownload={handleDownload} /> : null}
            {check === 3 ? <AdminUploadPage handleUpload={handleUpload} /> : null}
        </>
    );
}

export default AdminLogin;
