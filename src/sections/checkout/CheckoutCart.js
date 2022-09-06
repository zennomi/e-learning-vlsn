import sum from 'lodash/sum';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Grid, Card, Button, CardHeader, Typography } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  removeCart,
  onNextStep,
} from '../../redux/slices/order';
// routes
import { PATH_LEARNING } from '../../routes/paths';
// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import EmptyContent from '../../components/EmptyContent';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutProductList from './CheckoutProductList';

// ----------------------------------------------------------------------

export default function CheckoutCart() {
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.order);

  const totalItems = cart.length;

  const isEmptyCart = totalItems === 0;

  const total = sum(cart.map(p => p.price));

  const handleDeleteCart = (productId) => {
    dispatch(removeCart(productId));
  };

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Giỏ bao gồm
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({totalItems} sản phẩm)
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {!isEmptyCart ? (
            <Scrollbar>
              <CheckoutProductList
                products={cart}
                onDelete={handleDeleteCart}
              />
            </Scrollbar>
          ) : (
            <EmptyContent
              title="Giỏ trống"
              description="Có vẻ như bạn chưa cho gì vô giỏ."
              img="https://minimals.cc/assets/illustrations/illustration_empty_cart.svg"
            />
          )}
        </Card>

        <Button
          color="inherit"
          component={RouterLink}
          to={PATH_LEARNING.course.root}
          startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
        >
          Quay lại
        </Button>
      </Grid>

      <Grid item xs={12} md={4}>
        <CheckoutSummary
          enableDiscount
          total={total}
        />
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={cart.length === 0}
          onClick={handleNextStep}
        >
          Xác nhận
        </Button>
      </Grid>
    </Grid>
  );
}
