import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Music, 
  Utensils, 
  ShoppingBag, 
  Users, 
  Package, 
  ChevronLeft, 
  Share2, 
  Lock, 
  CheckCircle2, 
  Plus, 
  Image as ImageIcon,
  Gift,
  Trophy,
  ChevronUp,
  ChevronDown,
  UserCircle,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { AreaId, Area, Task, BackpackItem, PhotoGrid } from './types';
import { INITIAL_AREAS, INITIAL_TASKS, INITIAL_BACKPACK } from './constants';

// --- Components ---

const Header: React.FC<{ title: string; onBack?: () => void; isHome?: boolean }> = ({ title, onBack, isHome }) => (
  <header className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-pink-100 flex items-center justify-between px-4 z-50">
    <button 
      onClick={onBack} 
      disabled={isHome}
      className={`p-2 rounded-full ${isHome ? 'opacity-30 cursor-not-allowed' : 'active:bg-pink-50 text-pink-500'}`}
    >
      <ChevronLeft size={24} />
    </button>
    <h1 className="text-lg font-medium text-gray-800">{title}</h1>
    <button className="p-2 rounded-full active:bg-pink-50 text-pink-500">
      <Share2 size={20} />
    </button>
  </header>
);

const Sidebar: React.FC<{ activeTab: number; setActiveTab: (t: number) => void }> = ({ activeTab, setActiveTab }) => (
  <nav className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col gap-4 p-2 bg-white/60 backdrop-blur-lg border-l border-pink-100 rounded-l-2xl shadow-xl z-40">
    {[
      { id: 0, icon: Music, label: '玩法' },
      { id: 1, icon: Users, label: '社区' },
      { id: 2, icon: ShoppingBag, label: '周边' },
    ].map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
          activeTab === tab.id ? 'bg-pink-500 text-white shadow-lg scale-110' : 'text-pink-300 hover:text-pink-400'
        }`}
      >
        <tab.icon size={24} />
        <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
      </button>
    ))}
  </nav>
);

// --- Constants for Share Modal ---
const contacts = [
  { name: '阿强', avatar: 'https://picsum.photos/seed/p1/100/100', flag: '🎸' },
  { name: '小美', avatar: 'https://picsum.photos/seed/p2/100/100', flag: '🎤' },
  { name: '大壮', avatar: 'https://picsum.photos/seed/p3/100/100', flag: '🥁' },
  { name: '莉莉', avatar: 'https://picsum.photos/seed/p4/100/100', flag: '🎹' },
  { name: '张三', avatar: 'https://picsum.photos/seed/p5/100/100', flag: '🎧' },
];

const shareApps = [
  { name: '微信好友', icon: MessageSquare, color: 'bg-green-500' },
  { name: '朋友圈', icon: ImageIcon, color: 'bg-white border border-gray-100' },
  { name: 'QQ好友', icon: MessageSquare, color: 'bg-blue-400' },
  { name: '微博', icon: Share2, color: 'bg-red-400' },
];

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState(0); // 0: Play, 1: Community
  const [subPage, setSubPage] = useState<AreaId | null>(null);
  const [tokens, setTokens] = useState(10);
  const [areas, setAreas] = useState<Area[]>(INITIAL_AREAS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [backpack, setBackpack] = useState<BackpackItem[]>(INITIAL_BACKPACK);
  const [coins, setCoins] = useState(0);
  const [photoGrids, setPhotoGrids] = useState<PhotoGrid[]>(
    Array.from({ length: 4 }, (_, i) => ({ id: i, unlocked: true }))
  );
  const [showShareModal, setShowShareModal] = useState(false);
  const [stageDrawCount, setStageDrawCount] = useState(0);
  const [isTaskExpanded, setIsTaskExpanded] = useState(false);
  const [unlockModal, setUnlockModal] = useState<Area | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [gachaResult, setGachaResult] = useState<string | null>(null);

  useEffect(() => {
    const hasSticker1 = backpack.find(i => i.id === 'sticker_1')?.count || 0;
    const stageArea = areas.find(a => a.id === 'stage');
    const foodArea = areas.find(a => a.id === 'food');

    if (hasSticker1 > 0 && stageArea && !stageArea.unlocked) {
      setAreas(prev => prev.map(a => a.id === 'stage' ? { ...a, unlocked: true } : a));
      showToast('舞台区已自动解锁！');
    }

    if (stageArea?.unlocked && stageDrawCount >= 10 && foodArea && !foodArea.unlocked) {
      setAreas(prev => prev.map(a => a.id === 'food' ? { ...a, unlocked: true } : a));
      showToast('食物饮品区已自动解锁！');
    }
  }, [backpack, stageDrawCount, areas]);

  const shareApps = [
    { name: '语伴', icon: MessageSquare, color: 'bg-indigo-600' },
    { name: '动态', icon: Share2, color: 'bg-purple-500' },
    { name: '朋友圈', icon: Camera, color: 'bg-white border border-gray-100' },
    { name: '微信', icon: MessageSquare, color: 'bg-green-500' },
    { name: 'QQ', icon: UserCircle, color: 'bg-blue-500' },
  ];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleUnlockArea = (area: Area) => {
    // Check unlock conditions
    if (area.id === 'stage') {
      const hasSticker1 = backpack.find(i => i.id === 'sticker_1')?.count || 0;
      if (hasSticker1 <= 0) {
        showToast('请先在拍照打卡区获得贴纸1');
        return;
      }
    } else if (area.id === 'food') {
      const stageArea = areas.find(a => a.id === 'stage');
      if (!stageArea?.unlocked) {
        showToast('请先解锁舞台区');
        return;
      }
      if (stageDrawCount < 10) {
        showToast('请先在舞台区完成10次抽奖');
        return;
      }
    } else if (area.id === 'exchange') {
      const foodArea = areas.find(a => a.id === 'food');
      if (!foodArea?.unlocked) {
        showToast('请先解锁食物饮品区');
        return;
      }
    }

    if (tokens >= area.unlockCost) {
      setTokens(prev => prev - area.unlockCost);
      setAreas(prev => prev.map(a => a.id === area.id ? { ...a, unlocked: true } : a));
      setUnlockModal(null);
      setSubPage(area.id);
      showToast(`成功解锁 ${area.name}!`);
    } else {
      setUnlockModal(null);
      alert('快去做任务，赢Token吧！');
      setIsTaskExpanded(true);
    }
  };

  const handleTaskAction = (task: Task) => {
    if (task.maxCount !== undefined && task.completedCount >= task.maxCount) return;
    
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completedCount: t.completedCount + 1 } : t));
    setTokens(prev => prev + task.reward);
    showToast(`任务完成！获得 ${task.reward} Token`);
  };

  const handleGacha = (count: number, cost: number) => {
    if (tokens < cost) {
      showToast('Token 不足');
      return;
    }
    setTokens(prev => prev - cost);
    
    const results: string[] = [];
    const newBackpack = [...backpack];

    for (let i = 0; i < count; i++) {
      let result = '';
      if (subPage === 'stage') {
        setStageDrawCount(prev => prev + 1);
        const rand = Math.random();
        if (rand < 0.4) result = '音符碎片';
        else if (rand < 0.5) result = '贴纸2';
        else if (rand < 0.6) result = '碎片+2';
        else if (rand < 0.8) result = '再来一次';
        else result = '谢谢回顾';
      } else if (subPage === 'food') {
        const rand = Math.random();
        if (rand < 0.4) result = '鸡腿碎片';
        else if (rand < 0.5) result = '贴纸3';
        else if (rand < 0.6) result = '碎片+2';
        else if (rand < 0.8) result = '再来一次';
        else result = '谢谢回顾';
      }

      if (result === '再来一次') {
        setTokens(prev => prev + 1);
      }

      if (result === '碎片+2') {
        const fragType = subPage === 'stage' ? '音符碎片' : '鸡腿碎片';
        const itemIndex = newBackpack.findIndex(item => item.name === fragType);
        if (itemIndex > -1) {
          newBackpack[itemIndex] = { ...newBackpack[itemIndex], count: newBackpack[itemIndex].count + 2 };
        }
      } else if (result !== '谢谢回顾' && result !== '再来一次') {
        const itemIndex = newBackpack.findIndex(item => item.name === result);
        if (itemIndex > -1) {
          newBackpack[itemIndex] = { ...newBackpack[itemIndex], count: newBackpack[itemIndex].count + 1 };
        }
      }
      results.push(result);
    }
    
    setBackpack(newBackpack);
    setGachaResult(count === 1 ? results[0] : results.join(', '));
  };

  const handleExchange = (giftName: string, costItem: string, costAmount: number) => {
    const item = backpack.find(i => i.name === costItem);
    if (!item || item.count < costAmount) {
      showToast(`${costItem} 不足`);
      return;
    }

    setBackpack(prev => {
      const newBackpack = prev.map(i => {
        if (i.name === costItem) return { ...i, count: i.count - costAmount };
        return i;
      });
      
      // Add coins based on the gift value
      if (giftName.includes('1000coins')) setCoins(prev => prev + 1000);
      if (giftName.includes('10000coins')) setCoins(prev => prev + 10000);

      // Check if gift already exists
      const giftIndex = newBackpack.findIndex(i => i.name === giftName);
      if (giftIndex > -1) {
        newBackpack[giftIndex].count += 1;
        return [...newBackpack];
      } else {
        return [...newBackpack, {
          id: `gift_${Date.now()}`,
          name: giftName,
          type: 'gift',
          count: 1,
          category: '礼物'
        }];
      }
    });
    
    showToast(`成功兑换 ${giftName}!`);
  };

  const handleUnlockGrid = (id: number) => {
    if (tokens >= 2) {
      setTokens(prev => prev - 2);
      setPhotoGrids(prev => prev.map(g => g.id === id ? { ...g, unlocked: true } : g));
      showToast('宫格已解锁');
    } else {
      showToast('Token 不足');
    }
  };

  const handleUploadPhoto = (id: number) => {
    setPhotoGrids(prev => prev.map(g => g.id === id ? { ...g, imageUrl: `https://picsum.photos/seed/${id}/200` } : g));
    showToast('图片已上传');
  };

  const pageTitle = useMemo(() => {
    if (subPage) {
      const area = areas.find(a => a.id === subPage);
      return area?.name || '';
    }
    if (activeTab === 0) return '玩法区域';
    if (activeTab === 1) return '社区';
    if (activeTab === 2) return '周边兑换';
    return '';
  }, [activeTab, subPage, areas]);

  const handleBack = () => {
    if (subPage) setSubPage(null);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-gray-800 font-sans pb-20 overflow-x-hidden">
      <Header 
        title={pageTitle} 
        onBack={handleBack} 
        isHome={activeTab === 0 && !subPage} 
      />

      <main className="pt-16 px-4">
        {activeTab === 0 && (
          <div className="space-y-6">
            {!subPage ? (
              <div className="relative min-h-[80vh] py-10">

                {/* Area Nodes along the path */}
                <div className="flex gap-4 min-h-[80vh] py-6">
                  {/* Main Vertical Path */}
                  <div className="flex-1 flex flex-col items-center justify-center space-y-16 relative">
                    {/* Straight Vertical Line Decorator */}
                    <div className="absolute w-1.5 bg-pink-100 h-[80%] top-[10%] left-1/2 -translate-x-1/2 z-0 rounded-full opacity-50" />
                    
                    {/* Main Nodes: Food (Top), Stage (Middle), Photo (Bottom) */}
                    {(() => {
                      const mainAreas = areas.filter(a => a.id !== 'exchange');
                      const stageArea = mainAreas.find(a => a.id === 'stage');
                      const foodArea = mainAreas.find(a => a.id === 'food');
                      const hasSticker1 = backpack.find(i => i.id === 'sticker_1')?.count || 0;

                      return [...mainAreas].reverse().map((area, idx) => {
                        let canUnlock = false;
                        let lockReason = '';

                        if (!area.unlocked) {
                          if (area.id === 'stage') {
                            if (hasSticker1 > 0) {
                              canUnlock = true;
                            } else {
                              lockReason = '请先在拍照打卡区生成并分享四宫格';
                            }
                          } else if (area.id === 'food') {
                            if (stageArea?.unlocked && stageDrawCount >= 10) {
                              canUnlock = true;
                            } else if (!stageArea?.unlocked) {
                              lockReason = '请先解锁舞台区';
                            } else {
                              lockReason = '请先在舞台区完成10次抽奖';
                            }
                          }
                        }

                        return (
                          <motion.div
                            key={area.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative z-10 flex flex-col items-center"
                          >
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                if (area.unlocked) {
                                  setSubPage(area.id);
                                } else if (canUnlock) {
                                  setUnlockModal(area);
                                } else {
                                  showToast(lockReason || '该区域尚未开放');
                                }
                              }}
                              className={`group relative w-28 h-28 rounded-full flex items-center justify-center border-4 transition-all shadow-2xl ${
                                area.unlocked 
                                  ? 'bg-white border-pink-200' 
                                  : canUnlock 
                                    ? 'bg-pink-50 border-pink-400 border-dashed' 
                                    : 'bg-gray-100 border-gray-200 grayscale'
                              }`}
                            >
                              <div className={`p-4 rounded-full ${area.unlocked ? 'bg-pink-100 text-pink-500' : 'bg-gray-200 text-gray-400'}`}>
                                {area.id === 'photo' && <Camera size={40} />}
                                {area.id === 'stage' && <Music size={40} />}
                                {area.id === 'food' && <Utensils size={40} />}
                              </div>
                              
                              {/* Status Badge */}
                              {!area.unlocked && (
                                <div className="absolute -top-1 -right-1 bg-white p-1.5 rounded-full shadow-md border border-pink-100">
                                  {canUnlock ? <Lock size={14} className="text-pink-400" /> : <Lock size={14} className="text-gray-300" />}
                                </div>
                              )}
                            </motion.button>
                            
                            <div className="mt-3 text-center">
                              <span className={`text-lg font-black tracking-tight ${area.unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                                {area.name}
                              </span>
                              {area.unlocked && (
                                <div className="flex justify-center gap-0.5 mt-1">
                                  {[1, 2, 3].map(s => (
                                    <div key={s} className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      });
                    })()}
                  </div>
                </div>

                <motion.div 
                  initial={false}
                  animate={{ height: isTaskExpanded ? 'auto' : '120px' }}
                  className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border-t border-pink-100 z-30 px-6 pt-4 pb-24 overflow-hidden"
                >
                  <div 
                    className="flex flex-col items-center mb-4 cursor-pointer"
                    onClick={() => setIsTaskExpanded(!isTaskExpanded)}
                  >
                    <div className="w-12 h-1.5 bg-pink-100 rounded-full mb-2" />
                    <span className="text-sm font-bold text-pink-500 flex items-center gap-1">
                      任务列表 {isTaskExpanded ? <ChevronDown size={16}/> : <ChevronUp size={16}/>}
                    </span>
                  </div>

                  <div className="space-y-3 overflow-y-auto max-h-[60vh] pb-4">
                    {tasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-4 bg-pink-50/50 rounded-2xl border border-pink-100">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-800">{task.title}</h4>
                            {task.isVip && <span className="text-[10px] bg-yellow-400 text-white px-1.5 py-0.5 rounded-full font-bold">VIP</span>}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                          <div className="text-xs font-bold text-pink-500 mt-1">奖励: {task.reward} Token</div>
                        </div>
                        <button 
                          onClick={() => handleTaskAction(task)}
                          disabled={task.maxCount !== undefined && task.completedCount >= task.maxCount}
                          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                            task.maxCount !== undefined && task.completedCount >= task.maxCount
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-pink-500 text-white shadow-md active:scale-95'
                          }`}
                        >
                          {task.maxCount !== undefined && task.completedCount >= task.maxCount ? '已完成' : '去完成'}
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="space-y-6">
                {subPage === 'photo' && (
                  <div className="space-y-8">
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50">
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">集齐四宫格</h3>
                          <p className="text-sm text-gray-500">解锁宫格并上传你的音乐节瞬间</p>
                        </div>
                        <div className="text-pink-500 font-bold text-lg">
                          {photoGrids.filter(g => g.imageUrl).length}/4
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {photoGrids.map(grid => (
                          <div 
                            key={grid.id} 
                            className={`aspect-square rounded-2xl border-2 flex items-center justify-center overflow-hidden transition-all relative ${
                              grid.imageUrl ? 'border-pink-200' : 'border-pink-300 border-dashed bg-pink-50'
                            }`}
                          >
                            {grid.imageUrl ? (
                              <>
                                <img src={grid.imageUrl} alt="Grid" className="w-full h-full object-cover" />
                                <button 
                                  onClick={() => setPhotoGrids(prev => prev.map(g => g.id === grid.id ? { ...g, imageUrl: undefined } : g))}
                                  className="absolute top-2 right-2 bg-black/40 text-white p-1 rounded-full backdrop-blur-sm hover:bg-black/60 transition-colors"
                                >
                                  <Plus size={14} className="rotate-45" />
                                </button>
                              </>
                            ) : (
                              <button onClick={() => handleUploadPhoto(grid.id)} className="text-pink-400 flex flex-col items-center">
                                <Plus size={32} />
                                <span className="text-[10px] mt-1">上传</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 flex flex-col gap-3">
                        <div className="flex justify-between items-center px-2">
                          <span className="text-xs text-gray-400">上传 4 张图片即可生成四宫格</span>
                          <div className="flex items-center gap-1">
                            {photoGrids.filter(g => g.imageUrl).length >= 4 ? (
                              <CheckCircle2 size={14} className="text-green-500" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200" />
                            )}
                            <span className={`text-xs font-bold ${photoGrids.filter(g => g.imageUrl).length >= 4 ? 'text-green-500' : 'text-gray-400'}`}>
                              已就绪
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setShowShareModal(true);
                            // Also grant sticker if not already owned
                            const hasSticker1 = backpack.find(i => i.id === 'sticker_1')?.count || 0;
                            if (hasSticker1 === 0) {
                              setBackpack(prev => prev.map(i => i.id === 'sticker_1' ? { ...i, count: 1 } : i));
                              showToast('生成成功！获得贴纸1');
                            }
                          }}
                          disabled={photoGrids.filter(g => g.imageUrl).length < 4}
                          className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg disabled:bg-gray-200 disabled:shadow-none transition-all active:scale-95"
                        >
                          生成四宫格
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {(subPage === 'stage' || subPage === 'food') && (
                  <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-pink-50 text-center">
                      <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-500">
                        {subPage === 'stage' ? <Music size={48} /> : <Utensils size={48} />}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {subPage === 'stage' ? '舞台抽奖' : '美食抽奖'}
                      </h3>
                      {subPage === 'stage' && (
                        <div className="mb-6">
                          <div className="flex justify-between text-xs font-bold text-pink-400 mb-1 px-1">
                            <span>解锁美食区进度</span>
                            <span>{Math.min(stageDrawCount, 10)}/10</span>
                          </div>
                          <div className="w-full h-2 bg-pink-50 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(stageDrawCount * 10, 100)}%` }}
                              className="h-full bg-pink-500"
                            />
                          </div>
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mb-8">抽取碎片，集齐可兑换限定礼物</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleGacha(1, 1)}
                          className="py-4 bg-white border-2 border-pink-200 text-pink-500 rounded-2xl font-bold active:scale-95 transition-all"
                        >
                          抽 1 次 (1 Token)
                        </button>
                        <button 
                          onClick={() => handleGacha(10, 8)}
                          className="py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
                        >
                          十连抽 (8 Token)
                        </button>
                      </div>
                      
                      <div className="mt-8 p-4 bg-pink-50 rounded-2xl text-left">
                        <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-3">奖池说明</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {subPage === 'stage' ? (
                            <>
                              <li>• 音符碎片</li>
                              <li>• 贴纸2</li>
                              <li>• 碎片+2</li>
                              <li>• 再来一次</li>
                              <li>• 谢谢回顾</li>
                            </>
                          ) : (
                            <>
                              <li>• 鸡腿碎片</li>
                              <li>• 贴纸3</li>
                              <li>• 碎片+2</li>
                              <li>• 再来一次</li>
                              <li>• 谢谢回顾</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {subPage === 'exchange' && (
                  <div className="space-y-6 pb-20">
                    {/* Assets Section (Backpack Merge) */}
                    <div className="bg-gradient-to-br from-pink-500 to-rose-400 p-6 rounded-[32px] text-white shadow-lg relative overflow-hidden">
                      <div className="relative z-10 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs opacity-80 font-medium">我的 Token</div>
                          <div className="text-2xl font-black mt-1 flex items-baseline gap-1">
                            {tokens} <span className="text-[10px] opacity-60">Tokens</span>
                          </div>
                        </div>
                        <div className="border-l border-white/20 pl-4">
                          <div className="text-xs opacity-80 font-medium">我的 Coins</div>
                          <div className="text-2xl font-black mt-1 flex items-baseline gap-1">
                            {coins} <span className="text-[10px] opacity-60">Coins</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => { setSubPage(null); setIsTaskExpanded(true); }}
                          className="col-span-2 mt-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-bold border border-white/30 active:bg-white/30 transition-all text-center"
                        >
                          赚取更多 Token
                        </button>
                      </div>
                      <Music className="absolute -right-4 -bottom-4 text-white/10 w-24 h-24 rotate-12" />
                    </div>

                    {/* Exchange Section */}
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Gift size={20} className="text-pink-500" /> 礼物兑换
                      </h3>
                      <div className="space-y-3">
                        {[
                          { name: '音符 (1000coins)', costItem: '音符碎片', costAmount: 10 },
                          { name: '鸡腿 (10000coins)', costItem: '鸡腿碎片', costAmount: 10 },
                        ].map(item => (
                          <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <div>
                              <div className="font-bold text-sm">{item.name}</div>
                              <div className="text-[10px] text-gray-400">消耗: {item.costItem} x{item.costAmount}</div>
                            </div>
                            <button 
                              onClick={() => handleExchange(item.name, item.costItem, item.costAmount)}
                              className="px-4 py-1.5 bg-pink-500 text-white text-xs font-bold rounded-full shadow-sm active:scale-95"
                            >
                              兑换
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Backpack Items Section (Backpack Merge) */}
                    <div className="space-y-6">
                      {['碎片', '贴纸', '礼物'].map(category => {
                        const items = backpack.filter(i => i.category === category);
                        return (
                          <div key={category} className="space-y-3">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">{category}</h4>
                            <div className="grid grid-cols-3 gap-3">
                              {items.map(item => (
                                <div 
                                  key={item.id} 
                                  onClick={() => item.count === 0 && showToast('在对应区域抽奖获得')}
                                  className={`p-4 rounded-[24px] border flex flex-col items-center text-center transition-all ${
                                    item.count > 0 
                                      ? 'bg-white border-pink-100 shadow-sm' 
                                      : 'bg-gray-50 border-gray-100 opacity-50 grayscale'
                                  }`}
                                >
                                  <div className="relative mb-2">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.count > 0 ? 'bg-pink-50 text-pink-500' : 'bg-gray-200 text-gray-400'}`}>
                                      {item.type === 'fragment' && <Plus size={20} />}
                                      {item.type === 'sticker' && <ImageIcon size={20} />}
                                      {item.type === 'gift' && <Gift size={20} />}
                                    </div>
                                    {item.count > 0 && (
                                      <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full border-2 border-white">
                                        {item.count}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[9px] font-bold text-gray-600 line-clamp-1">{item.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Trophy size={20} className="text-pink-500" /> 限定装扮
                      </h3>
                      <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm">限定头像挂件</div>
                          <div className="text-[10px] text-gray-400">需集齐: 贴纸1 + 贴纸2 + 贴纸3</div>
                        </div>
                        <button 
                          onClick={() => {
                            const s1 = backpack.find(i => i.id === 'sticker_1')?.count || 0;
                            const s2 = backpack.find(i => i.id === 'sticker_2')?.count || 0;
                            const s3 = backpack.find(i => i.id === 'sticker_3')?.count || 0;
                            if (s1 > 0 && s2 > 0 && s3 > 0) {
                              setBackpack(prev => prev.map(i => {
                                if (i.id === 'sticker_1' || i.id === 'sticker_2' || i.id === 'sticker_3') return { ...i, count: i.count - 1 };
                                if (i.id === 'avatar_final') return { ...i, count: i.count + 1 };
                                return i;
                              }));
                              showToast('兑换成功！获得限定头像挂件');
                            } else {
                              showToast('贴纸不足');
                            }
                          }}
                          className="px-4 py-2 bg-pink-500 text-white text-xs font-bold rounded-full shadow-md active:scale-95"
                        >
                          立即兑换
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div className="space-y-6 pb-20">
            {/* Header Info - Simplified */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-400 p-8 rounded-[32px] text-white shadow-lg relative overflow-hidden flex items-center justify-center">
              <div className="relative z-10 text-center">
                <ShoppingBag size={48} className="mx-auto mb-2 opacity-80" />
                <div className="text-xl font-black tracking-tight">周边兑换中心</div>
              </div>
              <ShoppingBag className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 rotate-12" />
            </div>

            {/* Gift Styles Section */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Trophy size={20} className="text-pink-500" /> 礼物样式
              </h3>
              <div className="flex justify-center gap-12 mb-6">
                {[
                  { name: '头像框', icon: UserCircle },
                  { name: '聊天气泡', icon: MessageSquare },
                ].map(style => (
                  <div key={style.name} className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center text-pink-500 border border-pink-100 shadow-inner">
                      <style.icon size={40} />
                    </div>
                    <span className="text-xs font-bold text-gray-600">{style.name}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => showToast('集齐三个碎片解锁')}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-black rounded-2xl shadow-lg shadow-pink-200 active:scale-[0.98] transition-transform"
              >
                领取
              </button>
            </div>

            {/* Gift Exchange Section */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Gift size={20} className="text-pink-500" /> 礼物兑换
              </h3>
              <div className="space-y-3">
                {[
                  { name: '小音符 (100coins)', costItem: '音符碎片', costAmount: 3 },
                  { name: '音符 (1000coins)', costItem: '音符碎片', costAmount: 50 },
                  { name: '小鸡腿 (100coins)', costItem: '鸡腿碎片', costAmount: 3 },
                  { name: '鸡腿 (10000coins)', costItem: '鸡腿碎片', costAmount: 50 },
                ].map(item => (
                  <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <div className="font-bold text-sm">{item.name}</div>
                      <div className="text-[10px] text-gray-400">消耗: {item.costItem} x{item.costAmount}</div>
                    </div>
                    <button 
                      onClick={() => handleExchange(item.name, item.costItem, item.costAmount)}
                      className="px-4 py-1.5 bg-pink-500 text-white text-xs font-bold rounded-full shadow-sm active:scale-95"
                    >
                      兑换
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Collected Stats */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-pink-50">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Package size={20} className="text-pink-500" /> 已收集
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {backpack.filter(i => i.type === 'fragment' || i.type === 'sticker').map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-pink-50/50 rounded-xl border border-pink-100">
                    <span className="text-xs font-bold text-gray-600">{item.name}</span>
                    <span className="text-xs font-black text-pink-500">x{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Sidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setSubPage(null); }} />

      <AnimatePresence>
        {showShareModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="fixed inset-0 bg-black/40 z-[110] backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[120] px-6 pt-4 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
            >
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setShowShareModal(false)} className="p-2 text-gray-400">
                  <Plus size={24} className="rotate-45" />
                </button>
                <h3 className="text-lg font-bold text-gray-800">转发给</h3>
                <div className="w-10" /> {/* Spacer */}
              </div>

              {/* Contacts */}
              <div className="flex gap-5 overflow-x-auto pb-6 no-scrollbar">
                {contacts.map((contact, i) => (
                  <div key={i} className="flex flex-col items-center flex-shrink-0 gap-2">
                    <div className="relative">
                      <img src={contact.avatar} alt={contact.name} className="w-14 h-14 rounded-full bg-gray-100" />
                      <span className="absolute -bottom-1 -left-1 text-xs bg-white rounded-full p-0.5 shadow-sm">{contact.flag}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 max-w-[60px] truncate">{contact.name}</span>
                  </div>
                ))}
              </div>

              <div className="h-[1px] bg-gray-100 w-full mb-6" />

              {/* Apps */}
              <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
                {shareApps.map((app, i) => (
                  <div key={i} className="flex flex-col items-center flex-shrink-0 gap-2">
                    <div className={`w-14 h-14 rounded-2xl ${app.color} flex items-center justify-center text-white shadow-sm`}>
                      <app.icon size={28} className={app.name === '朋友圈' ? 'text-orange-400' : ''} />
                    </div>
                    <span className="text-[10px] text-gray-500">{app.name}</span>
                  </div>
                ))}
              </div>

              {/* List Actions */}
              <div className="bg-gray-50 rounded-2xl overflow-hidden">
                <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">复制链接</span>
                  <Plus size={18} className="text-gray-400 rotate-45" />
                </button>
                <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-700">收藏</span>
                  <Trophy size={18} className="text-gray-400" />
                </button>
              </div>
            </motion.div>
          </>
        )}

        {unlockModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[40px] p-8 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-500">
                <Lock size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">解锁该区域</h3>
              <p className="text-gray-500 mb-8">是否消耗 <span className="text-pink-500 font-bold">{unlockModal.unlockCost} Token</span> 解锁 {unlockModal.name}？</p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setUnlockModal(null)}
                  className="py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold active:scale-95 transition-all"
                >
                  不是
                </button>
                <button 
                  onClick={() => handleUnlockArea(unlockModal)}
                  className="py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
                >
                  是
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {gachaResult && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-white w-full max-w-sm rounded-[48px] p-10 text-center shadow-2xl border-4 border-pink-200"
            >
              <div className="text-pink-500 font-black text-xl mb-2 uppercase tracking-widest">恭喜获得</div>
              <div className="w-32 h-32 bg-pink-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-pink-500 shadow-inner">
                <Gift size={64} />
              </div>
              <h3 className="text-3xl font-black text-gray-800 mb-8">{gachaResult}</h3>
              <button 
                onClick={() => setGachaResult(null)}
                className="w-full py-5 bg-pink-500 text-white rounded-3xl font-bold shadow-xl active:scale-95 transition-all text-lg"
              >
                收下
              </button>
            </motion.div>
          </motion.div>
        )}

        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium z-[110] shadow-lg flex items-center gap-2"
          >
            <AlertCircle size={16} className="text-pink-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
