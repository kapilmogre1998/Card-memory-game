import { lazy, useEffect, useRef, useState } from 'react'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { CONFETTI_TIME, FLIPCARD_TIME, OPEN_MODAL_TIME, UNIQUECARDS } from './constant';
import { v4 as uuidv4 } from 'uuid';
import Modal from './Modal';
import './App.css';

const ConfettiExplosion = lazy(() => import('react-confetti-explosion'));

const App = () => {
  const [cardList, setCardList] = useState([]);
  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [disableDeck, setDisableDeck] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const movesCountRef = useRef(0);

  const shuffleCards = () => {
    movesCountRef.current = 0;
    let updatedCards = [...UNIQUECARDS, ...UNIQUECARDS].map((el) => ({ ...el, id: uuidv4() }));
    const length = updatedCards.length;
    for (let i = length; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * i);
      const currentIndex = i - 1;
      const temp = updatedCards[currentIndex];
      updatedCards[currentIndex] = updatedCards[randomIndex];
      updatedCards[randomIndex] = temp;
    }
    setCardList(updatedCards)
  }

  const matchCards = () => {
    const [first, second] = openCards;
    let firstCard = cardList.find((el) => el?.id === first);
    let secondCard = cardList.find(el => el?.id === second);
    if (firstCard.img !== secondCard.img) {
      setTimeout(() => {
        setClearedCards(clearedCards?.filter((id) => {
          if (!openCards?.includes(id)) return id;
        }))
        setOpenCards([]);
        setDisableDeck(false);
      }, FLIPCARD_TIME)
    } else {
      setDisableDeck(false);
      setOpenCards([]);
      if (clearedCards?.length === cardList?.length) {
        setTimeout(() => {
          setShowConfetti(true);
        }, CONFETTI_TIME)
        setTimeout(() => {
          setShowModal(true);
        }, OPEN_MODAL_TIME)
      }
    }
  }

  const handleClickOnCard = (id) => {
    movesCountRef.current = movesCountRef?.current + 1;
    if (openCards?.includes(id) || clearedCards?.includes(id) || disableDeck) return;
    setOpenCards(prev => ([...prev, id]));
    setClearedCards(prev => ([...prev, id]));
  }

  const handleRestart = () => {
    setShowModal(false);
    shuffleCards();
    setClearedCards([]);
    setShowConfetti(false);
  }

  useEffect(() => {
    if (openCards?.length === 2) {
      setDisableDeck(true);
      matchCards();
    }
  }, [openCards])

  useEffect(() => {
    if (UNIQUECARDS?.length) {
      shuffleCards();
    }
  }, [])

  return (
    <>
      <div className='card-container' >
        <div className='box' >
          <div className='confetti' >
            {showConfetti && <ConfettiExplosion {...{ force: 0.5, duration: 3000, particleCount: 300, width: 2000 }} />}
          </div>
          <div className='cards' >
            {cardList.map(({ img, id }) => <div key={id} className={`card ${clearedCards?.includes(id) && 'is-flipped'}`} onClick={() => handleClickOnCard(id)} >
              <QuestionMarkIcon className='view' fontSize='large' style={{ color: '#193A81' }} />
              <img className='view back-view' width={100} height={100} src={img} alt="" />
            </div>)}
          </div>
        </div>
      </div>
      {showModal && <Modal {...{ handleRestart }} ref={movesCountRef} />}
    </>
  )
}

export default App
