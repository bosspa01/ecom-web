import { useState, useEffect } from 'react';
import { Card, List, Image, Typography, Modal } from 'antd';
import { listTopSellingProducts } from '../../api/product';

const { Title, Paragraph } = Typography;

const TopSellingProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        loadTopProducts();
    }, []);

    const loadTopProducts = async () => {
        try {
            const res = await listTopSellingProducts();
            setProducts(res.data);
        } catch (err) {
            console.error('Error loading top products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (item) => {
        setSelectedProduct(item);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedProduct(null);
    };

    return (
        <div className="p-4 bg-white rounded shadow" >
        <Card 
            title={<Title level={4}>สินค้าขายดี</Title>}
            loading={loading}
            style={{ marginBottom: 24 }}
        >
            <List
                itemLayout="horizontal"
                dataSource={products}
                renderItem={(item, index) => (
                    <List.Item 
                        style={{ 
                            padding: '20px 0', 
                            borderBottom: '1px solid #f0f0f0',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onClick={() => handleCardClick(item)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <List.Item.Meta
                            avatar={
                                <Image 
                                    src={item.images?.[0]?.url || 'https://placeholder.com/100'} 
                                    alt={item.title}
                                    width={120}
                                    height={120}
                                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                                />
                            }
                            title={
                                <span style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                                    #{index + 1} {item.title}
                                </span>
                            }
                            description={
                                <div style={{ fontSize: '16px', marginTop: '8px', lineHeight: '1.8' }}>
                                    <div style={{ marginBottom: '4px' }}>
                                        <span style={{ fontWeight: '500' }}>หมวดหมู่:</span> {item.category?.name || 'N/A'}
                                    </div>
                                    <div style={{ marginBottom: '4px' }}>
                                        <span style={{ fontWeight: '500' }}>ขายแล้ว:</span> {item.totalSold || 0} ชิ้น
                                    </div>
                                    <div>
                                        <span style={{ fontWeight: '500' }}>ราคา:</span> ฿{item.price?.toLocaleString() || '0'}
                                    </div>
                                    <div style={{ marginTop: '8px', color: '#3b82f6', fontSize: '14px' }}>
                                        คลิกเพื่อดูรายละเอียด →
                                    </div>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>
        <Modal
            title={
                <div style={{ fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: '600' }}>
                    {selectedProduct?.title}
                </div>
            }
            open={isModalVisible}
            onCancel={handleModalClose}
            footer={null}
            width="90vw"
            style={{ maxWidth: '800px' }}
        >
            {selectedProduct && (
                <div style={{ padding: 'clamp(12px, 2vw, 16px)' }}>
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        {selectedProduct.images?.[0]?.url && (
                            <Image 
                                src={selectedProduct.images[0].url}
                                alt={selectedProduct.title}
                                style={{ 
                                    width: '100%',
                                    maxWidth: 'min(400px, 70vw)',
                                    height: 'auto',
                                    aspectRatio: '1 / 1',
                                    objectFit: 'cover', 
                                    borderRadius: '8px',
                                    display: 'block',
                                    margin: '0 auto'
                                }}
                                preview={false}
                            />
                        )}
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <Title level={5} style={{ marginBottom: '8px', fontSize: 'clamp(14px, 1.5vw, 16px)' }}>
                            รายละเอียดสินค้า
                        </Title>
                        <Paragraph style={{ 
                            fontSize: 'clamp(14px, 1.5vw, 16px)', 
                            lineHeight: '1.8', 
                            color: '#4b5563' 
                        }}>
                            {selectedProduct.description || 'ไม่มีรายละเอียด'}
                        </Paragraph>
                    </div>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                        gap: 'clamp(8px, 1.5vw, 12px)',
                        padding: 'clamp(12px, 2vw, 16px)',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px'
                    }}>
                        <div>
                            <span style={{ 
                                fontWeight: '600', 
                                color: '#6b7280',
                                fontSize: 'clamp(12px, 1.3vw, 14px)'
                            }}>
                                หมวดหมู่:
                            </span>
                            <div style={{ 
                                fontSize: 'clamp(14px, 1.5vw, 16px)', 
                                marginTop: '4px' 
                            }}>
                                {selectedProduct.category?.name || 'N/A'}
                            </div>
                        </div>
                        <div>
                            <span style={{ 
                                fontWeight: '600', 
                                color: '#6b7280',
                                fontSize: 'clamp(12px, 1.3vw, 14px)'
                            }}>
                                ราคา:
                            </span>
                            <div style={{ 
                                fontSize: 'clamp(14px, 1.5vw, 16px)', 
                                marginTop: '4px' 
                            }}>
                                ฿{selectedProduct.price?.toLocaleString() || '0'}
                            </div>
                        </div>
                        <div>
                            <span style={{ 
                                fontWeight: '600', 
                                color: '#6b7280',
                                fontSize: 'clamp(12px, 1.3vw, 14px)'
                            }}>
                                จำนวนคงเหลือ:
                            </span>
                            <div style={{ 
                                fontSize: 'clamp(14px, 1.5vw, 16px)', 
                                marginTop: '4px' 
                            }}>
                                {selectedProduct.quantity || 0} ชิ้น
                            </div>
                        </div>
                        <div>
                            <span style={{ 
                                fontWeight: '600', 
                                color: '#6b7280',
                                fontSize: 'clamp(12px, 1.3vw, 14px)'
                            }}>
                                ขายแล้ว:
                            </span>
                            <div style={{ 
                                fontSize: 'clamp(14px, 1.5vw, 16px)', 
                                marginTop: '4px', 
                                color: '#10b981' 
                            }}>
                                {selectedProduct.totalSold || 0} ชิ้น
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
        </div>
    );
};

export default TopSellingProducts;