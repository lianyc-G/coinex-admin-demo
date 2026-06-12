import { useState, useMemo, useCallback } from 'react';
import { NOTIFICATIONS as INITIAL_NOTIFICATIONS } from './data/notifications';
import { MOCK_CODE_KEYS } from './data/mockCodeKeys';
import type { Tab, Notification, Channel } from './data/types';
import TabNav from './components/TabNav';
import SearchBar from './components/SearchBar';
import NotificationTable from './components/NotificationTable';
import NotificationDrawer from './components/NotificationDrawer';
import AddSceneModal from './components/AddSceneModal';
import UnlinkedKeysModal from './components/UnlinkedKeysModal';

function App() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<Tab>('安全');
  const [filters, setFilters] = useState({ subModule: '', channel: '', keyword: '' });
  const [drawerItem, setDrawerItem] = useState<Notification | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUnlinkedModal, setShowUnlinkedModal] = useState(false);
  const [prefillKey, setPrefillKey] = useState<string | null>(null);
  const [prefillChannel, setPrefillChannel] = useState<Channel | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Compute unlinked keys: keys in MOCK_CODE_KEYS not linked to any notification
  const unlinkedKeys = useMemo(() => {
    const linkedKeys = new Set(
      notifications.map((n) => {
        // Match by exact templateName or suffix
        for (const key of Object.keys(MOCK_CODE_KEYS)) {
          if (n.templateName === key || n.templateName.endsWith(key)) {
            return key;
          }
        }
        return null;
      }).filter(Boolean) as string[]
    );

    return Object.entries(MOCK_CODE_KEYS)
      .filter(([key]) => !linkedKeys.has(key))
      .map(([key, data]) => ({
        key,
        title: data.title,
        body: data.body,
        channel: data.channel,
      }));
  }, [notifications]);

  // Count records per tab
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const n of notifications) {
      counts[n.module] = (counts[n.module] || 0) + 1;
    }
    return counts;
  }, [notifications]);

  // Filtered list based on active tab + search
  const filteredList = useMemo(() => {
    let list = notifications.filter((n) => n.module === activeTab);

    if (filters.subModule) {
      list = list.filter((n) => n.subModule === filters.subModule);
    }
    if (filters.channel) {
      list = list.filter((n) => n.channel === filters.channel);
    }
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      list = list.filter(
        (n) =>
          n.sceneName.toLowerCase().includes(kw) ||
          n.triggerCondition.toLowerCase().includes(kw) ||
          n.title.toLowerCase().includes(kw) ||
          n.body.toLowerCase().includes(kw)
      );
    }
    return list;
  }, [activeTab, filters, notifications]);

  // Sub-module options for current tab
  const subModuleOptions = useMemo(() => {
    const options = new Set(
      notifications.filter((n) => n.module === activeTab).map((n) => n.subModule)
    );
    return Array.from(options).sort();
  }, [activeTab, notifications]);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setFilters({ subModule: '', channel: '', keyword: '' });
  }, []);

  const handleSearch = useCallback((params: { subModule: string; channel: string; keyword: string }) => {
    setFilters(params);
  }, []);

  // Drawer navigation
  const currentIdx = drawerItem ? filteredList.findIndex((n) => n.id === drawerItem.id) : -1;
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < filteredList.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev && currentIdx > 0) {
      setDrawerItem(filteredList[currentIdx - 1]);
    }
  }, [hasPrev, currentIdx, filteredList]);

  const handleNext = useCallback(() => {
    if (hasNext && currentIdx < filteredList.length - 1) {
      setDrawerItem(filteredList[currentIdx + 1]);
    }
  }, [hasNext, currentIdx, filteredList]);

  // Add new scene
  const handleAddScene = useCallback((record: Notification) => {
    setNotifications((prev) => [...prev, record]);
    setShowAddModal(false);

    // Switch to the record's tab
    setActiveTab(record.module as Tab);

    // Highlight the new row for 3 seconds
    setHighlightedId(record.id);
    setTimeout(() => {
      setHighlightedId(null);
    }, 3000);
  }, []);

  // Open add modal with prefilled values
  const handleOpenAddWithPrefill = useCallback((key: string, channel: Channel) => {
    setShowUnlinkedModal(false);
    setPrefillKey(key);
    setPrefillChannel(channel);
    setShowAddModal(true);
  }, []);

  // Clear prefill after modal opens
  const handleAddModalOpen = useCallback(() => {
    setPrefillKey(null);
    setPrefillChannel(null);
    setShowAddModal(true);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-[1400px] mx-auto px-6 py-5">
        {/* Header */}
        <header className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 m-0">自动化触达内容管理</h1>
            <p className="text-xs text-gray-400 mt-0.5">V1.0 · 只读查询</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              共 <span className="text-gray-800 font-medium">{notifications.length}</span> 条记录
            </div>
            <button
              onClick={handleAddModalOpen}
              className="px-4 py-1.5 bg-[#1677ff] text-white text-sm rounded-md hover:bg-[#1677ff]/90 transition-colors"
            >
              + 新增场景
            </button>
          </div>
        </header>

        {/* Tab Nav + Unlinked keys button */}
        <div className="flex items-stretch">
          <div className="flex-1 min-w-0">
            <TabNav
              activeTab={activeTab}
              tabCounts={tabCounts}
              onTabChange={handleTabChange}
            />
          </div>
          <div className="flex items-center pl-3 border-b border-gray-200">
            <button
              onClick={() => setShowUnlinkedModal(true)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap ${
                unlinkedKeys.length > 0
                  ? 'text-orange-600 hover:bg-orange-50'
                  : 'text-gray-400'
              }`}
            >
              <span>🔔 未关联 key</span>
              {unlinkedKeys.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-orange-500 text-white text-[10px] leading-none rounded-full font-medium">
                  {unlinkedKeys.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          subModuleOptions={subModuleOptions}
          onSearch={handleSearch}
        />

        {/* Result count */}
        <div className="text-xs text-gray-400 mb-3">
          共 <span className="text-gray-600 font-medium">{filteredList.length}</span> 条记录
        </div>

        {/* Table */}
        <NotificationTable
          notifications={filteredList}
          onView={setDrawerItem}
          highlightedId={highlightedId}
        />
      </div>

      {/* Drawer */}
      <NotificationDrawer
        item={drawerItem}
        onClose={() => setDrawerItem(null)}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {/* Add Scene Modal */}
      <AddSceneModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setPrefillKey(null);
          setPrefillChannel(null);
        }}
        onSave={handleAddScene}
        prefillKey={prefillKey}
        prefillChannel={prefillChannel}
      />

      {/* Unlinked Keys Modal */}
      <UnlinkedKeysModal
        open={showUnlinkedModal}
        onClose={() => setShowUnlinkedModal(false)}
        keys={unlinkedKeys}
        onAddNow={handleOpenAddWithPrefill}
      />
    </div>
  );
}

export default App;
