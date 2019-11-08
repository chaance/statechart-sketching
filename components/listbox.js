import { Machine } from 'xstate';

// NOTE: All timing values are multiplied by 10 so it's easier to interact with in the visualizer.

const selectingEvents = {
  KEY_ARROW_UP: {
    target: 'selectingWithKeys',
    actions: ['navigatePrev']
  },
  KEY_ARROW_DOWN: {
    target: 'selectingWithKeys',
    actions: ['navigateNext']
  },
  ITEM_POINTER_ENTER: {
    target: 'selecting',
    actions: ['highlightItem']
  },
  ITEM_POINTER_LEAVE: {
    target: 'selecting',
    actions: ['resetHighlightIndex']
  },
  ITEM_POINTER_DOWN: 'clickingItem',
  ITEM_POINTER_UP: {
    target: 'confirming',
    cond: 'dragStarted'
  },
  DOC_POINTER_UP: {
    target: 'finished',
    actions: ['focusBox'],
    cond: 'dragStarted'
  },
  KEY_ENTER: {
    target: 'confirming',
    cond: 'hasHighlight'
  },
  KEY_SPACE: {
    target: 'confirming',
    cond: 'hasHighlight'
  },
  HOME: {
    target: 'selectingWithKeys',
    actions: ['highlightFirst']
  },
  END: {
    target: 'selectingWithKeys',
    actions: ['highlightLast']
  },
  KEY_CHAR: {
    // TODO
    target: 'searching',
    actions: []
  }
};

const machine = Machine({
  id: 'listbox',
  initial: 'idle',
  context: {
    searchStartIndex: -1,
    index: 0,
    search: '',
    activeIndex: -1,
    items: null
  },
  states: {
    idle: {
      on: {
        BOX_CLICK: {
          target: 'open'
        },
        BOX_POINTER_DOWN: {
          target: 'open.clickingBox'
        },
        KEYDOWN_ENTER: {
          target: 'idle',
          actions: ['submit'],
          cond: 'isFormElement'
        },
        KEYDOWN_SPACE: {
          target: 'open.selectingWithKeys',
          actions: ['focusSelectedItem']
        },
        KEYDOWN_DOWN_ARROW: {
          target: 'open.selectingWithKeys',
          actions: ['focusSelectedItem']
        },
        KEYDOWN_UP_ARROW: {
          target: 'open.selectingWithKeys',
          actions: ['focusSelectedItem']
        }
      }
    },
    open: {
      entry: ['disableTooltips'],
      exit: ['enableTooltips'],
      onDone: 'idle',
      on: {
        KEY_ESCAPE: {
          target: 'idle',
          actions: ['focusBox'],
          cond: 'notConfirming'
        },
        BLUR: {
          target: 'idle',
          cond: 'notConfirming'
        }
      },
      initial: 'selecting',
      states: {
        selecting: {
          entry: ['focusSelectedItem'],
          on: {
            ...selectingEvents
          }
        },
        selectingWithKeys: {
          entry: ['focusSelectedItem'],
          on: {
            ...selectingEvents,
            POINTER_MOVE: {
              target: 'selecting',
              actions: ['resetHighlightIndex']
            }
          }
        },
        selectingWithDrag: {
          entry: ['startDrag'],
          on: {
            ...selectingEvents,
            ITEM_POINTER_ENTER: {
              ...selectingEvents.ITEM_POINTER_ENTER,
              target: 'selectingWithDrag'
            },
            ITEM_POINTER_LEAVE: {
              ...selectingEvents.ITEM_POINTER_LEAVE,
              target: 'selectingWithDrag'
            }
          }
        },
        searching: {
          // TODO
        },
        confirming: {
          after: {
            2000: {
              target: 'finished',
              actions: ['focusBox', 'selectItem']
            }
          }
        },
        clickingBox: {
          entry: ['highlightSelectedItem'],
          after: {
            2000: 'selectingWithDrag'
          },
          on: {
            BOX_POINTER_UP: 'selecting',
            BOX_POINTER_LEAVE: 'selectingWithDrag'
          }
        },
        clickingItem: {
          after: {
            2000: 'selectingWithDrag'
          },
          on: {
            ITEM_POINTER_LEAVE: 'selectingWithDrag',
            ITEM_POINTER_UP: {
              target: 'confirming'
            }
          }
        },
        finished: {
          type: 'final'
        }
      }
    }
  }
});

export default machine;
