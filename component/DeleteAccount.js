import React, { useState } from 'react';
import ConfirmDeleteAccount from './ConfirmDeleteAccount';

const DeleteAccount = () => {
    const [ deleteState, setDeleteState ] = useState('confirm');

    return deleteState === 'confirm' && <ConfirmDeleteAccount setDeleteState={setDeleteState} />
    return deleteState === 'feedback' && <DeleteAccountFeedBack setDeleteState={setDeleteState} />
    return deleteState === 'deleted' && <DeletedAccount setDeleteState={setDeleteState} />
}