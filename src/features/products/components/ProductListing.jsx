import React from 'react';
import ProductCard from './ProductCard';
import EmptyState from '../../../components/shared/EmptyState';
import { useTranslation } from 'react-i18next';

const ProductListing = ({ products }) => {
  const { t } = useTranslation();

  if (products.length === 0) {
    return (
      <EmptyState
        message={t('shop.no_products')}
        btnText={t('shop.clear_filters')}
        btnLink="/shop"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductListing;
