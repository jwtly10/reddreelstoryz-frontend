import {Button, Modal} from "antd";

function SessionExpiredModalComponent ({showModal, handleOk}: {showModal: boolean, handleOk: () => void}){
    return (
        <Modal
            title="Session Expired"
            centered
            open={showModal}
            closable={false}
            footer={[
                <Button key="confirm" type="primary" onClick={handleOk}>
                    Ok
                </Button>,
            ]}
        >
            <p>Your session has expired, please login again.</p>
        </Modal>
    )

}

export default SessionExpiredModalComponent;