import React, { Component } from 'react';
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setAdminAction } from '../store/action';

export default function AddAdmin() {
    const walletAdd = useSelector(state => state.walletAddress);
    const admins = useSelector(state => state.admins);
    const [block, setBlock] = useState('none');
    const [adminIndex, setAdminIndex] = useState(0);
    const [adminAddress, setAdminAddress] = useState('');
    const dispatch = useDispatch();
    function setAdmin() {
        // var address = prompt("please enter wallet address of admin!");
       dispatch( setAdminAction({ind: adminIndex, address: adminAddress}));
    }
    function resetAdmin(ind) {
        
       dispatch( setAdminAction({ind: ind, address: '0x0000000000000000000000000000000000000000'}));
    }
    return (
        <>
            <div className="modal" id="myModal" style={{ display: block }}>
                <div className="modal-dialog border border-white">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title" style={{ fontSize: "1.2rem" }}>please enter wallet address of admin! </h4>
                            <button type="button" className="close" data-dismiss="modal" onClick={(e) => {setBlock('none')}}>&times;</button>
                        </div>
                        <div className="form-group mx-2">
                            <input type="text" value={adminAddress} className="form-control" id="usr" onChange={e=>{setAdminAddress(e.target.value)}}/>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={e=>{setBlock('none');setAdmin();}}>OK</button>
                        </div>
                    </div>
                </div>
            </div>
            <section className="author-area">
                <div className="container">
                    <div className="text-white p-4">Only Master Admin(who deployed market contract) can add or remove admins.</div>
                    {admins.map((admin, ind) => (
                        <div key={ind} className="border border-white rounded-lg p-3">
                            <span className="text-white">{(ind == 0) ? "Master Admin" : "Admin     "}</span>
                            <span className="px-4">{(admin == "0x0000000000000000000000000000000000000000") ? "No set" : admin}</span>
                            {(ind > 0) && (
                                <div className="float-right">
                                    <button type="button" className="btn btn-primary mx-4" style={{ padding: "5px 15px" }} onClick={(e) => {setAdminAddress(''); setBlock('block'); setAdminIndex(ind-1)}}>Set Admin</button>
                                    <button type="button" className="btn btn-danger" style={{ padding: "5px 15px" }} onClick={e=>{resetAdmin(ind-1);}}>Reset Admin</button>
                                </div>
                            )}

                        </div>
                    ))}

                </div>
            </section>
        </>
    );
}