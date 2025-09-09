
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Text } from '@/shared/ui/Text';
import { getUserAuthData } from '@/entities/User';
import { updateProfile } from '@/features/UpdateProfile';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import cls from './ProfilePage.module.scss';

export default function ProfilePage() {
    const user = useSelector(getUserAuthData);
    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Form state
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        name: user?.name || '',
        avatar: user?.avatar || '',
    });

    const handleEdit = useCallback(() => {
        setIsEditing(true);
        setError('');
    }, []);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        setFormData({
            username: user?.username || '',
            email: user?.email || '',
            name: user?.name || '',
            avatar: user?.avatar || '',
        });
        setError('');
    }, [user]);

    const handleSave = useCallback(async () => {
        if (!user) return;

        setIsLoading(true);
        setError('');

        try {
            await dispatch(updateProfile(formData)).unwrap();
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, formData, user]);

    const handleInputChange = useCallback((field: string) => (value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    const getInitials = useCallback((name?: string, username?: string) => {
        const displayName = name || username || '';
        return displayName
            .split(' ')
            .map(word => word.charAt(0))
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }, []);

    if (!user) {
        return (
            <div className={cls.ProfilePage}>
                <div className={cls.error}>
                    <Text title="Error" text="Please log in to view your profile." />
                </div>
            </div>
        );
    }

    return (
        <div className={cls.ProfilePage}>
            <div className={cls.header}>
                <Text 
                    title="Profile" 
                    size="size_l"
                    className={cls.title}
                />
                {!isEditing && (
                    <Button
                        theme="primary"
                        onClick={handleEdit}
                        className={cls.editButton}
                    >
                        Edit Profile
                    </Button>
                )}
            </div>

            <div className={cls.content}>
                {error && (
                    <div className={cls.error}>
                        <Text text={error} theme="error" />
                    </div>
                )}

                <div className={cls.avatar}>
                    <div className={classNames(cls.avatarImage, {}, [user.avatar ? '' : cls.avatarPlaceholder])}>
                        {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" />
                        ) : (
                            getInitials(user.name, user.username)
                        )}
                    </div>
                    {isEditing && (
                        <Button
                            theme="clear"
                            size="size_m"
                            className={cls.changeAvatarButton}
                        >
                            Change Avatar
                        </Button>
                    )}
                </div>

                {isEditing ? (
                    <div className={cls.form}>
                        <div className={cls.formGroup}>
                            <Input
                                label="Username"
                                value={formData.username}
                                onChange={handleInputChange('username')}
                                placeholder="Enter your username"
                            />
                        </div>

                        <div className={cls.formGroup}>
                            <Input
                                label="Full Name"
                                value={formData.name}
                                onChange={handleInputChange('name')}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className={cls.formGroup}>
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className={cls.formGroup}>
                            <Input
                                label="Avatar URL"
                                value={formData.avatar}
                                onChange={handleInputChange('avatar')}
                                placeholder="Enter avatar URL"
                            />
                        </div>

                        <div className={cls.actions}>
                            <Button
                                theme="background"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                theme="primary"
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className={cls.infoRow}>
                            <div className={cls.infoLabel}>Username</div>
                            <div className={cls.infoValue}>{user.username || 'Not set'}</div>
                        </div>

                        <div className={cls.infoRow}>
                            <div className={cls.infoLabel}>Full Name</div>
                            <div className={cls.infoValue}>{user.name || 'Not set'}</div>
                        </div>

                        <div className={cls.infoRow}>
                            <div className={cls.infoLabel}>Email</div>
                            <div className={cls.infoValue}>{user.email || 'Not set'}</div>
                        </div>

                        <div className={cls.infoRow}>
                            <div className={cls.infoLabel}>User ID</div>
                            <div className={cls.infoValue}>{user.id}</div>
                        </div>

                        {user.roles && user.roles.length > 0 && (
                            <div className={cls.infoRow}>
                                <div className={cls.infoLabel}>Roles</div>
                                <div className={cls.infoValue}>{user.roles.join(', ')}</div>
                            </div>
                        )}

                        <div className={cls.stats}>
                            <Text title="Typing Statistics" size="size_m" />
                            <div className={cls.statsGrid}>
                                <div className={cls.statCard}>
                                    <div className={cls.statValue}>0</div>
                                    <div className={cls.statLabel}>Tests Completed</div>
                                </div>
                                <div className={cls.statCard}>
                                    <div className={cls.statValue}>0</div>
                                    <div className={cls.statLabel}>Average WPM</div>
                                </div>
                                <div className={cls.statCard}>
                                    <div className={cls.statValue}>0%</div>
                                    <div className={cls.statLabel}>Average Accuracy</div>
                                </div>
                                <div className={cls.statCard}>
                                    <div className={cls.statValue}>0</div>
                                    <div className={cls.statLabel}>Best WPM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
