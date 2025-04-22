// Sample data for the messaging system
export const mockMessages = [
  {
    id: '1',
    contact: {
      id: '101',
      name: 'Nguyễn Tiến Dũng',
      avatar: null,
    },
    lastMessage: 'Bạn có thể cho biết lịch trình của bạn không ạ?',
    timestamp: '2023-06-30T10:30:00',
    isRead: false,
  },
  {
    id: '2',
    contact: {
      id: '102',
      name: 'Trần Văn Đức',
      avatar: null,
    },
    lastMessage: 'Chào bạn...',
    timestamp: '2023-06-29T15:45:00',
    isRead: true,
  },
  {
    id: '3',
    contact: {
      id: '103',
      name: 'Lê Mỹ Linh',
      avatar: null,
    },
    lastMessage: 'Hello',
    timestamp: '2023-06-30T09:15:00',
    isRead: false,
  },
  {
    id: '4',
    contact: {
      id: '104',
      name: 'Nguyễn Đoàn Bảo Châu',
      avatar: null,
    },
    lastMessage: 'hi',
    timestamp: '2023-01-26T09:26:00',
    isRead: false,
  },
  {
    id: '5',
    contact: {
      id: '105',
      name: 'Nguyễn Hoàng Tấn',
      avatar: null,
    },
    lastMessage: 'vâng cảm ơn bạn',
    timestamp: '2023-01-21T09:21:00',
    isRead: true,
  },
  {
    id: '6',
    contact: {
      id: '106',
      name: 'Trần Văn Nam',
      avatar: null,
    },
    lastMessage: 'Bạn: heelo Nam',
    timestamp: '2022-12-28T20:33:00',
    isRead: true,
  },
];

// Mock conversation data
export const mockConversations = [
  {
    contactId: '101',
    messages: [
      {
        id: 'm1',
        text: 'Chào bạn',
        timestamp: '2023-06-30T10:15:00',
        sender: 'contact',
      },
      {
        id: 'm2',
        text: 'Tư vấn giúp tôi ạ?',
        timestamp: '2023-06-30T10:20:00',
        sender: 'me',
      },
      {
        id: 'm3',
        text: 'Bạn có thể cho biết lịch trình của bạn không ạ?',
        timestamp: '2023-06-30T10:30:00',
        sender: 'contact',
      },
    ],
  },
  {
    contactId: '102',
    messages: [
      {
        id: 'm1',
        text: 'Chào bạn...',
        timestamp: '2023-06-29T15:45:00',
        sender: 'contact',
      },
    ],
  },
  {
    contactId: '103',
    messages: [
      {
        id: 'm1',
        text: 'Hello',
        timestamp: '2023-06-30T09:15:00',
        sender: 'contact',
      },
    ],
  },
];