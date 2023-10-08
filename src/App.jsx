import { lazy, useEffect, useRef, useState } from 'react'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { CONFETTI_TIME, FLIPCARD_TIME, OPEN_MODAL_TIME, UNIQUECARDS } from './constant';
import { v4 as uuidv4 } from 'uuid';
import Modal from './Modal';
import './App.css';

const ConfettiExplosion = lazy(() => import('react-confetti-explosion'));

const App = () => {
  const [gameData, setGameData] = useState({
    cardList: [],
    openCards: [],
    clearedCards: [],
    showConfetti: false,
    disableDeck: false,
    movesCountRef: useRef(0),
    showModal: false
  })
  const { cardList, openCards, clearedCards, showConfetti, disableDeck, movesCountRef, showModal } = gameData;

  const shuffleCards = () => {
    movesCountRef.current = 0;
    let updatedCards = [...UNIQUECARDS, ...UNIQUECARDS].map((el) => ({ ...el, id: uuidv4() }));
    //shuffle cards
    for (let i = updatedCards.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [updatedCards[i], updatedCards[randomIndex]] = [updatedCards[randomIndex], updatedCards[i]];
    }
    setGameData(prev => ({ ...prev, cardList: updatedCards }));
  }

  const matchCards = () => {
    const [first, second] = openCards;
    //match cards
    let firstCard = cardList.find((el) => el?.id === first);
    let secondCard = cardList.find(el => el?.id === second);
    if (firstCard.img !== secondCard.img) {
      setTimeout(() => {
        setGameData(prev => ({
          ...prev,
          clearedCards: clearedCards?.filter((id) => !openCards?.includes(id)),
          openCards: [],
          disableDeck: false
        }))
      }, FLIPCARD_TIME)
    } else {
      setGameData(prev => ({ ...prev, disableDeck: false, openCards: [] }))
      if (clearedCards?.length === cardList?.length) {
        setTimeout(() => {
          setGameData(prev => ({ ...prev, showConfetti: true }));
        }, CONFETTI_TIME)
        setTimeout(() => {
          setGameData(prev => ({ ...prev, showModal: true }));
        }, OPEN_MODAL_TIME)
      }
    }
  }

  const handleClickOnCard = (id) => {
    movesCountRef.current = movesCountRef?.current + 1;
    if (openCards?.includes(id) || clearedCards?.includes(id) || disableDeck) return;
    setGameData(prev => ({ ...prev, openCards: [...prev.openCards, id], clearedCards: [...prev.clearedCards, id] }));
  }

  const handleRestart = () => {
    setGameData(prev => ({ ...prev, showModal: false }));
    shuffleCards();
    setGameData(prev => ({ ...prev, clearedCards: [], showConfetti: false }));
  }

  useEffect(() => {
    if (openCards?.length === 2) {
      setGameData(prev => ({ ...prev, disableDeck: true }))
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
              <img className='view back-view' src={img} alt="" />
            </div>)}
          </div>
        </div>
      </div>
      <Modal {...{ handleRestart }} display={showModal} ref={movesCountRef} />
    </>
  )
}

export default App
