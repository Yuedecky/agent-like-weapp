Component({
  properties:{
    product:Object,
  },
  data:{
    
  },
  methods:{
    onTapProduct:function(event){
      this.triggerEvent('productTap',{
        pid:this.properties.book.id
      },
      {})      
    }
  },
  
})