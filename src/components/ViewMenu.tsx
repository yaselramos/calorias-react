type ViewMode = "search" | "manage"

type ViewMenuProps = {
  activeView: ViewMode
  onChangeView: (view: ViewMode) => void
}

export default function ViewMenu({ activeView, onChangeView }: ViewMenuProps) {
  return (
    <nav className="view-menu" aria-label="Cambiar vista">
      <button
        type="button"
        className={`view-menu__button ${activeView === "search" ? "view-menu__button--active" : ""}`}
        onClick={() => onChangeView("search")}
      >
        Buscar
      </button>
      <button
        type="button"
        className={`view-menu__button ${activeView === "manage" ? "view-menu__button--active" : ""}`}
        onClick={() => onChangeView("manage")}
      >
        Gestionar
      </button>
    </nav>
  )
}

export type { ViewMode }

