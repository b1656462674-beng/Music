import { Area, Task, BackpackItem } from './types';

export const INITIAL_AREAS: Area[] = [
  { id: 'photo', name: '拍照打卡区', unlockCost: 0, unlocked: true, order: 1 },
  { id: 'stage', name: '舞台区', unlockCost: 0, unlocked: false, order: 2 },
  { id: 'food', name: '食物饮品区', unlockCost: 0, unlocked: false, order: 3 },
  { id: 'exchange', name: '周边兑换区', unlockCost: 0, unlocked: true, order: 4 },
];

export const INITIAL_TASKS: Task[] = [
  { id: 'checkin', title: '每日签到', description: '连续签到领 Token', reward: 100, type: 'daily', completedCount: 0, maxCount: 1 },
  { id: 'post', title: '发布现场动态', description: '分享你的音乐节瞬间 (≥25字+1图)', reward: 1, type: 'daily', completedCount: 0, maxCount: 1 },
  { id: 'likes', title: '动态获赞', description: '获得 30 个赞', reward: 1, type: 'daily', completedCount: 0, maxCount: 3 },
  { id: 'vip_boost', title: 'VIP 专属助力', description: '为他人动态点赞', reward: 1, type: 'daily', completedCount: 0, maxCount: 1, isVip: true },
  { id: 'ads', title: '观看演出预告', description: '看视频领 Token', reward: 1, type: 'daily', completedCount: 0, maxCount: 1 },
  { id: 'share', title: '邀请乐迷', description: '首次分享活动得奖励', reward: 1, type: 'once', completedCount: 0, maxCount: 1 },
  { id: 'gift', title: '赠送应援礼物', description: '送礼得 Token', reward: 1, type: 'unlimited', completedCount: 0 },
];

export const INITIAL_BACKPACK: BackpackItem[] = [
  { id: 'note_frag', name: '音符碎片', type: 'fragment', count: 0, category: '碎片' },
  { id: 'leg_frag', name: '鸡腿碎片', type: 'fragment', count: 0, category: '碎片' },
  { id: 'sticker_1', name: '贴纸1', type: 'sticker', count: 0, category: '贴纸' },
  { id: 'sticker_2', name: '贴纸2', type: 'sticker', count: 0, category: '贴纸' },
  { id: 'sticker_3', name: '贴纸3', type: 'sticker', count: 0, category: '贴纸' },
  { id: 'avatar_1', name: '头像挂件1', type: 'decoration', count: 0, category: '装扮' },
  { id: 'avatar_frame', name: '头像框', type: 'decoration', count: 0, category: '装扮' },
  { id: 'chat_bubble', name: '聊天气泡', type: 'decoration', count: 0, category: '装扮' },
  { id: 'gift_note_small', name: '小音符 (100coins)', type: 'gift', count: 0, category: '礼物' },
  { id: 'gift_note_big', name: '音符 (1000coins)', type: 'gift', count: 0, category: '礼物' },
  { id: 'gift_leg_small', name: '小鸡腿 (100coins)', type: 'gift', count: 0, category: '礼物' },
  { id: 'gift_leg_big', name: '鸡腿 (10000coins)', type: 'gift', count: 0, category: '礼物' },
];
