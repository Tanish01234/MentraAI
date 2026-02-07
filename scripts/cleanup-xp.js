// Cleanup script to remove XP data from localStorage
if (typeof window !== 'undefined') {
    localStorage.removeItem('userXP')
    localStorage.removeItem('gameMode')
    localStorage.removeItem('imageUploads')
    console.log('✅ Cleaned up gaming mode and XP data from localStorage')
}
