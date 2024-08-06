function Modal(props) {
  return (
    <div
      className="modal fade"
      id={props.id}
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ zIndex: 1000000 }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {props.title || "Confirmação"}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{props.body}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Voltar
            </button>
            <button
              type={props.submit ? "submit" : "button"}
              onClick={props.onClick || null}
              data-bs-dismiss="modal"
              className={
                "btn" + (props.danger ? " btn-danger" : " btn-primary")
              }
            >
              {props.confirm || "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
