import { useRef, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';

const Modal = (props) => {
  // const dialog = useRef();

  // if(isopen) {
  //   dialog.current.showModal()
  // }

  // useEffect(() => {
  //   if (isopen) {
  //     dialog.current.showModal();
  //   } else {
  //     dialog.current.close();
  //   }
  // }, [isopen]);


  // return createPortal(
  //   <Fragment>
  //     <div className='overlay'></div>
  //     <div className="modal" onClick={onClose}>
  //       {children}
  //     </div>
  //   </Fragment>,
  //   document.getElementById('modal')
  // );
  const Backdrop = () => {
    return <div className='overlay' onClick={props.onClick}></div>
  }

  const Modal = () => {
    return <div className='modal'>{props.children}</div>
  }
  return (
    <Fragment>
      {createPortal(<Backdrop onClick={props.onClick} />, document.getElementById('modal'))}
      {createPortal(<Modal>{props.children}</Modal>, document.getElementById('modal'))}
    </Fragment> 
  )
}

export default Modal;
