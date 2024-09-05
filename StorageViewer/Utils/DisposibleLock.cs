namespace StorageViewer.Utils;

internal class DisposibleLock
{
    internal class LockKey : IDisposable
    {
        private readonly bool isReadLock;
        private readonly DisposibleLock parentLock;
        private bool isActive = true;

        internal LockKey(DisposibleLock parentLock, bool isReadLock)
        {
            this.isReadLock = isReadLock;
            this.parentLock = parentLock;
        }
        
        public void Dispose()
        {
            if (isActive)
            {
                parentLock.Unlock(isReadLock);
            }
            isActive = false;
        }
    }

    private readonly ReaderWriterLockSlim systemLock = new();

    public LockKey EnterReadLock()
    {
        systemLock.EnterReadLock();
        return new LockKey(this, true);
    }

    public LockKey EnterWriteLock()
    {
        systemLock.EnterWriteLock();
        return new LockKey(this, false);
    }

    private void Unlock(bool isReadLock)
    {
        if (isReadLock)
        {
            systemLock.ExitReadLock();
        }
        else
        {
            systemLock.ExitWriteLock();
        }
    }
}