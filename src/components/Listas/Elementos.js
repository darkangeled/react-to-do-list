import styles from "./Elementos.module.scss";

export const Header = () => {
  const hoy = new Date();
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return (
    <div className={styles['panel-heading']}>
      <p className="card-header-title">
        {diasSemana[hoy.getDay()] + " " + hoy.getDate() + ", "}
      </p>
      <p className={["card-header-title", styles.mes].join(" ")}>
        {meses[hoy.getMonth()] + " " + hoy.getFullYear()}
      </p>
    </div>
  );
};

export const Tarea = (props) => {
  const deleteHandler = () => {
    props.onDelete(props.id);
  };

  return (
    <label className="panel-block is-justify-content-space-between">
      <div className="is-pulled-left">
        <input type="checkbox" key={props.id} onChange={props.onChange} />
        <span className={styles[props.className]}>{props.children}</span>
      </div>
      <div className="is-pulled-right">
        <button
          type="button"
          className="button is-small is-danger"
          key={props.id}
          id={props.id}
          onClick={deleteHandler}
          disabled={props.disabled}
        >
          <span className="icon is-small material-icons">delete</span>
        </button>
      </div>
    </label>
  );
};

export const Footer = (props) => {
  return (
    <footer className="card-footer is-fullwidth">
      <p className="card-footer-item">
        <b>Total tareas:&nbsp;</b>{props.total}
      </p>
      <p className="card-footer-item">
        <b>Tareas completadas:&nbsp;</b>{props.completadas}
      </p>
      <p className="card-footer-item">
        <b>Tareas abiertas:&nbsp;</b>{props.abiertas}
      </p>
    </footer>
  );
};

export const Error = (props) => {
  return (
    <>
      <div className="icon-text has-text-warning">
        <span className="icon material-icons">notification_important</span>
        <span>Alerta</span>
      </div>
      <p className="help is-danger">{props.texto}</p>
    </>
  );
}