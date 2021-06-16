import styles from './Form.module.scss';
import { Error } from '../Listas/Elementos';

const Form = ({ value, onClick, onChange, onKeyDown, error, errorTxt }) => {
  return (
    <div className="field has-addons">
      <div className="control is-expanded">
        <input
          className={["input", "is-primary", styles.inputTarea].join(" ")}
          type="text"
          placeholder="Agregue sus tareas a la lista de pendientes"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={value}
        />
        {error && <Error texto={errorTxt} />}
      </div>
      <p className="control">
        <button
          className={[
            "button",
            "is-primary",
            "is-outlined",
            styles.buttonAdd,
          ].join(" ")}
          type="button"
          onClick={onClick}
        >
          <span className="icon is-small material-icons">add_circle</span>
          <span>Agregar</span>
        </button>
      </p>
    </div>
  );
};

export default Form;