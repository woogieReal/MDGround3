export const widthResizeHandler = (
  mouseDownEvent: any,
  drawerWidth: number,
  setDrawerWidth: (changedWidth: number) => void
) => {
  const startSize = drawerWidth;
  const startPosition = mouseDownEvent.pageX;

  const onMouseMove = (mouseMoveEvent: any) => {
    setDrawerWidth(startSize - startPosition + mouseMoveEvent.pageX);
  };
  const onMouseUp = () => {
    document.body.removeEventListener("mousemove", onMouseMove);
  };

  document.body.addEventListener("mousemove", onMouseMove);
  document.body.addEventListener("mouseup", onMouseUp, { once: true });
};
